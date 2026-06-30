"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ variant = "outline", size = "sm", className }: { variant?: "default"|"outline"|"ghost"|"secondary"; size?: "default"|"sm"|"lg"|"icon"; className?: string }) {
  return <Button type="button" variant={variant} size={size} className={className} onClick={() => window.print()} aria-label="Print"><Printer className="h-4 w-4" /><span className="ml-1.5 hidden sm:inline">Print</span></Button>;
}
