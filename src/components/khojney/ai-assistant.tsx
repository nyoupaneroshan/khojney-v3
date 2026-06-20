"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Which engineering college is best for me in Kathmandu?",
  "How do I prepare for IOE entrance exam?",
  "What scholarships are available for +2 students?",
  "How do I apply for a Nepali passport?",
  "Which bank offers the highest fixed deposit rate?",
];

const GREETING: Message = {
  role: "assistant",
  content:
    "Namaste! 🙏 I'm Khojney AI Assistant. I can help you with exams, colleges, scholarships, banks, jobs, and government services in Nepal. How can I help you today?",
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const reply = data.reply ?? "I'm sorry, I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment, or browse our resources directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([GREETING]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl",
          open && "hidden",
        )}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[600px]">
          <div
            className="absolute inset-0 bg-black/40 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="relative flex h-full sm:rounded-2xl flex-col border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary to-red-600 px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Khojney Assistant</div>
                  <div className="text-[10px] opacity-90">AI-powered · Nepal education & services expert</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                  onClick={reset}
                  title="Reset conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                  onClick={() => setOpen(false)}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl bg-card border border-border rounded-bl-sm px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="pt-2">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 px-1">
                    Try asking
                  </div>
                  <div className="space-y-1.5">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => send(p)}
                        className="block w-full text-left rounded-lg border border-border bg-card px-3 py-2 text-xs hover:bg-accent transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-card p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Nepal..."
                  rows={1}
                  className="min-h-[40px] max-h-[120px] resize-none text-sm"
                  disabled={loading}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="h-9 w-9 shrink-0"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
                AI may produce inaccurate information. Verify important details.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
