"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ForgotPasswordForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialEmail = sp.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send reset link");
      }
      setSent(true);
      setDevResetUrl(data.devResetUrl ?? null);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell user={null}>
      <div className="container-app py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
            </Link>
          </Button>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Forgot your password?</CardTitle>
              <CardDescription>
                Enter your email and we&apos;ll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Check your email</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      If an account exists for <span className="font-medium">{email}</span>,
                      a reset link has been sent. The link expires in 1 hour.
                    </p>
                  </div>
                  {devResetUrl && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-left">
                      <p className="text-xs font-medium text-amber-900 mb-1">
                        Dev mode — reset link (no email sent):
                      </p>
                      <Link
                        href={devResetUrl}
                        className="break-all text-xs text-amber-700 underline hover:text-amber-900"
                      >
                        {devResetUrl}
                      </Link>
                    </div>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Return to login</Link>
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setDevResetUrl(null);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Use a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9"
                        autoComplete="email"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Remembered your password?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <AppShell user={null}>
          <div className="container-app py-20 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
          </div>
        </AppShell>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
