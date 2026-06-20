"use client";

import { useState } from "react";
import { Bookmark, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface JobActionsProps {
  title: string;
  /** Optional: id of the job for future bookmark-by-id flow. */
  jobId?: string;
}

/**
 * Tiny client component for the "Save" + "Share" buttons on the job detail page.
 * Save uses local state (no API yet). Share uses navigator.share when available,
 * otherwise copies the URL to the clipboard.
 */
export function JobActions({ title, jobId: _jobId }: JobActionsProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  function onShare() {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title, url })
        .catch(() => {
          /* user dismissed — ignore */
        });
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(true);
          toast.success("Link copied to clipboard");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => toast.error("Could not copy link"));
    }
  }

  function onSave() {
    setSaved((prev) => {
      const next = !prev;
      toast.success(next ? "Saved to bookmarks" : "Removed from bookmarks");
      return next;
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={saved ? "default" : "outline"}
        size="sm"
        className="flex-1"
        onClick={onSave}
      >
        <Bookmark className="h-4 w-4" /> {saved ? "Saved" : "Save"}
      </Button>
      <Button variant="outline" size="sm" className="flex-1" onClick={onShare}>
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
    </div>
  );
}
