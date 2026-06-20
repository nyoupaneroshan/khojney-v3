import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

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

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[]; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userMessages =
    body.messages ??
    (body.question ? [{ role: "user" as const, content: body.question }] : []);

  if (!userMessages.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...userMessages.slice(-10),
  ];

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
    console.error("AI assistant error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "AI service unavailable", details: message },
      { status: 503 },
    );
  }
}
