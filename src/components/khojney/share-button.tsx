"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  /** Title to prefill share text. */
  title: string;
  /** Optional description / share text body. */
  text?: string;
  /** Canonical URL to share. If omitted, uses window.location.href. */
  url?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Share button with multiple options: native Web Share API (where available),
 * copy-link-to-clipboard, and direct links to popular social platforms.
 */
export function ShareButton({
  title,
  text,
  url,
  variant = "outline",
  size = "sm",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = () => {
    if (typeof window === "undefined") return url ?? "";
    return url ?? window.location.href;
  };

  async function nativeShare() {
    const target = shareUrl();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: target });
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      await copyLink();
    }
  }

  async function copyLink() {
    const target = shareUrl();
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  function openShareUrl(shareUrl: string) {
    if (typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=540");
    }
  }

  const current = shareUrl();
  const encodedUrl = encodeURIComponent(current);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text ?? title);

  return (
    <div className={cn("inline-flex", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={variant} size={size} className="gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Share this page</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={nativeShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share via…
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyLink}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-600" /> Copied!
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" /> Copy link
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
            }
          >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-xs font-bold">
              f
            </span>{" "}
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openShareUrl(
                `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
              )
            }
          >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-xs font-bold">
              X
            </span>{" "}
            Twitter / X
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openShareUrl(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
              )
            }
          >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-xs font-bold">
              in
            </span>{" "}
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openShareUrl(
                `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
              )
            }
          >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-xs font-bold">
              W
            </span>{" "}
            WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
