"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  /** Optional URL to share; falls back to `window.location.href`. */
  shareUrl?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Share button for detail pages. Uses the Web Share API when available,
 * falling back to clipboard copy. No `useEffect` — all state transitions
 * happen inside event handlers.
 */
export function ShareButton({
  title,
  shareUrl,
  variant = "outline",
  size = "sm",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url =
      shareUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled — no-op */
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Could not copy link");
      }
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
      aria-label="Share this page"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" /> Copied
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" /> Share
        </>
      )}
    </Button>
  );
}
