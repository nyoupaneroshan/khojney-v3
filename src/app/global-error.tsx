"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="mt-3 text-muted-foreground">
              An unexpected error occurred. Our team has been notified. Please try again, or return to the home page.
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Error ID: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{error.digest}</code>
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                <RefreshCw className="h-4 w-4" /> Try Again
              </button>
              <Link href="/" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-accent">
                <Home className="h-4 w-4" /> Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
