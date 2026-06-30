"use client";
import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export function NewsletterSignup() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!email.trim() || !email.includes("@")) { toast.error("Valid email required."); return; } setLoading(true); await new Promise(r => setTimeout(r, 800)); setLoading(false); setDone(true); toast.success("Subscribed!"); };
  if (done) return <div className="flex flex-col items-center py-4"><CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" /><p className="font-medium text-sm">Subscribed!</p></div>;
  return <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"><div className="relative flex-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required /></div><Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}</Button></form>;
}
