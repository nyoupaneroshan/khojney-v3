import { db } from "@/lib/db";
export async function triggerWebhooks(event: string, data: Record<string, unknown>): Promise<void> {
  try {
    const webhooks = await db.webhook.findMany({ where: { isActive: true } }).catch(()=>[]);
    const matching = webhooks.filter((wh) => { try { const e = JSON.parse(wh.events) as string[]; return e.includes(event) || e.includes("*"); } catch { return false; } });
    if (!matching.length) return;
    const payload = { event, timestamp: new Date().toISOString(), data };
    await Promise.allSettled(matching.map((wh) => fireWebhook(wh.id, wh.url, wh.secret, payload)));
  } catch (e) { console.error("Webhook error:", e); }
}
async function fireWebhook(id: string, url: string, secret: string | null, payload: { event: string; timestamp: string; data: Record<string, unknown> }) {
  const body = JSON.stringify(payload);
  const headers: Record<string,string> = { "Content-Type": "application/json", "X-Khojney-Event": payload.event };
  let statusCode: number | null = null; let resBody: string | null = null; let ok = false;
  try { const r = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(10000) }); statusCode = r.status; resBody = (await r.text()).slice(0,500); ok = r.ok; }
  catch (e) { resBody = e instanceof Error ? e.message.slice(0,500) : "Failed"; }
  try { await db.webhookLog.create({ data: { webhookId: id, event: payload.event, payload: body.slice(0,2000), statusCode, response: resBody, success: ok } }); await db.webhook.update({ where: { id }, data: { lastTriggered: new Date(), lastStatus: ok?"success":"failed", lastResponse: resBody, triggerCount: { increment: 1 } } }); } catch {}
}
