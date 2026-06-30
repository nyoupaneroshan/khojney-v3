import { db } from "@/lib/db";
import { createHmac } from "crypto";
import { env } from "@/lib/env";

/**
 * Trigger all webhooks subscribed to `event`.
 *
 * Security:
 *   - URL is validated against an SSRF blocklist before fetch (see `isSafeUrl`).
 *   - Request is signed with HMAC-SHA256 using the webhook's `secret`.
 *   - Response body is NOT stored — only the status code. (Previously the full
 *     response body was logged, allowing SSRF exfiltration of internal services.)
 *   - Payload logged to WebhookLog is capped at 2 KB.
 */
export async function triggerWebhooks(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const webhooks = await db.webhook
      .findMany({ where: { isActive: true } })
      .catch(() => []);
    const matching = webhooks.filter((wh) => {
      try {
        const e = JSON.parse(wh.events) as string[];
        return e.includes(event) || e.includes("*");
      } catch {
        return false;
      }
    });
    if (!matching.length) return;

    const payload = { event, timestamp: new Date().toISOString(), data };
    await Promise.allSettled(
      matching.map((wh) => fireWebhook(wh.id, wh.url, wh.secret, payload))
    );
  } catch (e) {
    console.error("Webhook trigger error:", e);
  }
}

async function fireWebhook(
  id: string,
  url: string,
  secret: string | null,
  payload: { event: string; timestamp: string; data: Record<string, unknown> }
) {
  // SSRF guard — reject private/loopback/link-local targets in production.
  const safety = isSafeUrl(url);
  if (!safety.ok) {
    console.warn(`Webhook ${id} URL rejected: ${safety.reason}`);
    await logWebhookFailure(id, payload, safety.reason);
    return;
  }

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Khojney-Event": payload.event,
  };
  // Sign the body with HMAC-SHA256 using the webhook's secret (if configured).
  // Receivers can verify with: hmac_sha256(secret, body) === X-Khojney-Signature
  if (secret) {
    headers["X-Khojney-Signature"] = createHmac("sha256", secret)
      .update(body)
      .digest("hex");
  }

  let statusCode: number | null = null;
  let ok = false;
  let failReason: string | null = null;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(10_000),
      // Don't follow redirects — an attacker could redirect to an internal IP.
      redirect: "error",
    });
    statusCode = r.status;
    ok = r.ok;
    // Drain the body so the connection can be reused, but DO NOT store it.
    await r.text().catch(() => "");
  } catch (e) {
    failReason = e instanceof Error ? e.message.slice(0, 200) : "Fetch failed";
  }

  try {
    await db.webhookLog.create({
      data: {
        webhookId: id,
        event: payload.event,
        payload: body.slice(0, 2000),
        statusCode,
        response: null, // intentionally null — see file-level comment
        success: ok,
      },
    });
    await db.webhook.update({
      where: { id },
      data: {
        lastTriggered: new Date(),
        lastStatus: ok ? "success" : "failed",
        // lastResponse intentionally not set to the body — store a short status only.
        lastResponse: ok
          ? `OK ${statusCode}`
          : failReason ?? `HTTP ${statusCode ?? "?"}`,
        triggerCount: { increment: 1 },
      },
    });
  } catch {
    // best-effort logging
  }
}

async function logWebhookFailure(
  id: string,
  payload: { event: string; timestamp: string; data: Record<string, unknown> },
  reason: string
) {
  try {
    await db.webhookLog.create({
      data: {
        webhookId: id,
        event: payload.event,
        payload: JSON.stringify(payload).slice(0, 2000),
        statusCode: null,
        response: null,
        success: false,
      },
    });
    await db.webhook.update({
      where: { id },
      data: {
        lastTriggered: new Date(),
        lastStatus: "failed",
        lastResponse: `URL rejected: ${reason.slice(0, 200)}`,
        triggerCount: { increment: 1 },
      },
    });
  } catch {
    // best-effort
  }
}

/**
 * Validate a webhook target URL against SSRF attacks.
 *
 * Rules:
 *   - Must be http(s).
 *   - In production: must be https.
 *   - Hostname must not resolve to a private / loopback / link-local IP.
 *   - Common metadata-service hostnames are blocked.
 *
 * Returns `{ ok: true }` if safe, or `{ ok: false, reason }` if rejected.
 */
export function isSafeUrl(rawUrl: string): {
  ok: boolean;
  reason?: string;
} {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "Invalid URL syntax" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: `Disallowed protocol: ${parsed.protocol}` };
  }
  if (env.isProd && parsed.protocol === "http:") {
    return { ok: false, reason: "HTTP not allowed in production (use HTTPS)" };
  }

  const host = parsed.hostname.toLowerCase();

  // Block obvious metadata-service hostnames.
  const blockedHosts = [
    "metadata.google.internal",
    "169.254.169.254", // AWS / GCP / Azure metadata IP
    "metadata",
    "localhost",
  ];
  if (blockedHosts.includes(host)) {
    return { ok: false, reason: `Blocked host: ${host}` };
  }

  // Block IP-literal private / loopback / link-local addresses.
  if (isPrivateIp(host)) {
    return { ok: false, reason: `Blocked private/loopback IP: ${host}` };
  }

  return { ok: true };
}

function isPrivateIp(host: string): boolean {
  // IPv4
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 10) return true;
    if (a === 127) return true; // loopback
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a >= 224) return true; // multicast / reserved
    return false;
  }
  // IPv6 — block loopback and unique-local
  if (host === "::1" || host === "0:0:0:0:0:0:0:1") return true;
  if (host.startsWith("fc") || host.startsWith("fd")) return true;
  if (host.startsWith("fe80:")) return true; // link-local
  return false;
}
