"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
export function BackToTop() {
  const [v, setV] = useState(false);
  useEffect(() => { const h = () => setV(window.scrollY > 400); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  if (!v) return null;
  return <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={cn("fixed bottom-20 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-accent transition-all lg:bottom-6")} aria-label="Back to top"><ArrowUp className="h-4 w-4" /></button>;
}
