import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { getSession } from "@/lib/auth-server";
import { aiLimiter, aiDailyLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are Khojney Assistant, a friendly AI helper for the Khojney.com platform — Nepal's information, education, and resource ecosystem.

Your role is to help Nepali students, parents, and educators with:
- Information about Nepali exams (IOE, MBBS, CMAT, Loksewa, Driving License, SEE, +2, Nursing, Teacher License)
- Guidance on colleges, schools, and universities in Nepal
- Scholarship search and application advice (local and international)
- Career counseling for Nepali students
- Banking services and interest rates in Nepal
- Government services (citizenship, passport, PAN, driving license, tax)
- Study tips and exam preparation strategies

Guidelines:
- Be concise, friendly, and helpful. Keep responses under 300 words unless explicitly asked for detail.
- When recommending specific resources, mention that the user can find more details by searching on khojney.com.
- If you don't know something specific (like current cutoff marks or live NEPSE data), recommend the user check the official source.
- Use Nepali context: NPR for currency, BS for dates when relevant, mention specific Nepali institutions by name.
- Encourage users to take mock exams available on Khojney for practice.
- For sensitive topics (medical, legal, financial decisions), recommend consulting a professional.

Always be encouraging and supportive — Nepali students often face significant pressure and your tone should be motivating.`;

const MAX_MESSAGE_LEN = 4_000; // per message
const MAX_MESSAGES = 10; // per request (we keep the last 10)

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * POST /api/ai/assistant
 *
 * Authenticated, rate-limited AI chat endpoint.
 *   - Requires a logged-in session (no anonymous use).
 *   - 10 messages per minute per user.
 *   - 50 messages per day per user.
 *   - Each message capped at 4,000 chars.
 *   - Upstream SDK errors are logged server-side; the client only sees a
 *     generic "AI service unavailable" message (no provider details leaked).
 */
export async function POST(req: NextRequest) {
  // 1. Require auth.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Rate limit (per-user). Fall back to IP if the user ID is somehow empty.
  const identifier = session.id || getClientIp(req);
  const rlMin = aiLimiter.check(`ai:min:${identifier}`);
  if (!rlMin.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rlMin.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }
  const rlDay = aiDailyLimiter.check(`ai:day:${identifier}`);
  if (!rlDay.allowed) {
    return NextResponse.json(
      { error: "Daily message limit reached. Try again tomorrow." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rlDay.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // 3. Parse + validate body.
  let body: { messages?: ChatMessage[]; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userMessages =
    body.messages ??
    (body.question ? [{ role: "user" as const, content: body.question }] : []);

  if (!Array.isArray(userMessages) || userMessages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  // Cap each message length and total count.
  const trimmed: ChatMessage[] = userMessages
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role === "assistant" || m.role === "system" ? m.role : "user",
      content: String(m.content ?? "").slice(0, MAX_MESSAGE_LEN),
    }))
    .filter((m) => m.content.length > 0);

  if (trimmed.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...trimmed,
  ];

  // 4. Call the AI provider.
  try {
    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages,
      stream: false,
      thinking: { type: "disabled" },
    });

    const reply = response.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ ok: true, reply, usage: response.usage });
  } catch (err: unknown) {
    // Log the full error server-side; return only a generic message to the client.
    console.error(
      "AI assistant error:",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 503 }
    );
  }
}
