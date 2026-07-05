"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Trophy,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialMode = sp.get("mode") === "register" ? "register" : "login";
  const callbackUrl = sp.get("callbackUrl") ?? "/dashboard";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Keep mode in sync with URL changes
  useEffect(() => {
    const m = sp.get("mode") === "register" ? "register" : "login";
    setMode(m);
  }, [sp]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      toast.error("Please fill in both email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Login failed");
      }
      toast.success(`Welcome back, ${data.user.name ?? data.user.email}!`);
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (regPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    if (regPassword !== regConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Registration failed");
      }
      toast.success(`Account created. Welcome, ${data.user.name}!`);
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

   
  return (
    <AppShell user={null}>
      <div className="container-app py-8 md:py-12">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 max-w-5xl mx-auto">
          {/* Left: Form */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {mode === "login"
                  ? "Login to access mock exams, bookmarks, and your dashboard."
                  : "Join thousands of Nepali students using Khojney."}
              </p>
            </div>

            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "login" | "register")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>

              {/* Login form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Login to your account</CardTitle>
                    <CardDescription>
                      Enter your credentials below to continue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="pl-9"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showLoginPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="pl-9 pr-10"
                            autoComplete="current-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showLoginPassword ? "Hide password" : "Show password"}
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </form>

                     
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Register form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Create a free account</CardTitle>
                    <CardDescription>
                      It takes less than a minute. No credit card needed.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-name">Full Name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-name"
                            type="text"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Your name"
                            className="pl-9"
                            autoComplete="name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="reg-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-email"
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="pl-9"
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="reg-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-password"
                            type={showRegPassword ? "text" : "password"}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="At least 4 characters"
                            className="pl-9 pr-10"
                            autoComplete="new-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showRegPassword ? "Hide password" : "Show password"}
                          >
                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="reg-confirm">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-confirm"
                            type={showRegPassword ? "text" : "password"}
                            value={regConfirm}
                            onChange={(e) => setRegConfirm(e.target.value)}
                            placeholder="Re-enter password"
                            className="pl-9"
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Marketing panel */}
          <div className="hidden lg:flex">
            <div className="w-full rounded-2xl bg-gradient-to-br from-red-50 via-white to-blue-50 border border-border p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                Why join Khojney?
              </div>

              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Everything you need to ace your next exam.
              </h2>
              <p className="text-muted-foreground mb-6">
                Join Nepal&rsquo;s fastest-growing education community. Free forever.
              </p>

              <ul className="space-y-4">
                <Feature
                  icon={<Trophy className="h-5 w-5" />}
                  title="Free mock exams"
                  desc="IOE, MBBS, CMAT, Loksewa & more — with instant scoring and detailed explanations."
                />
                <Feature
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Smart bookmarks"
                  desc="Save colleges, scholarships, and articles to revisit later."
                />
                <Feature
                  icon={<Award className="h-5 w-5" />}
                  title="Track achievements"
                  desc="Earn badges as you take more exams and improve your scores."
                />
                <Feature
                  icon={<Search className="h-5 w-5" />}
                  title="Universal search"
                  desc="Find anything across 1000+ entries in our Nepal directory."
                />
              </ul>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <Stat number="8+" label="Mock Exams" />
                <Stat number="200+" label="Questions" />
                <Stat number="12+" label="Colleges" />
              </div>

              <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-lg bg-white border p-3">
      <p className="text-xl font-bold text-primary">{number}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
