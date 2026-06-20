"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  /** Entity type, e.g. "BANK", "COLLEGE", "EXAM". */
  entity: string;
  /** Unique entity ID. */
  entityId: string;
  /** Optional label for the entity (used in toast messages). */
  entityName?: string;
  /** Visual variant. */
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const STORAGE_KEY = "khojney:bookmarks";

type StoredBookmark = { entity: string; entityId: string; name?: string };

function readBookmarks(): StoredBookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredBookmark[];
  } catch {
    return [];
  }
}

function writeBookmarks(items: StoredBookmark[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Notify other components on the same page
    window.dispatchEvent(new Event("khojney:bookmark-change"));
  } catch {
    /* ignore quota errors */
  }
}

/**
 * Bookmark toggle for any entity. Uses localStorage for persistence so it works
 * for anonymous visitors — a server-backed bookmark API can be added later
 * without changing this component's API.
 */
export function BookmarkButton({
  entity,
  entityId,
  entityName,
  variant = "outline",
  size = "sm",
  className,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setMounted(true);
      const items = readBookmarks();
      setSaved(items.some((b) => b.entity === entity && b.entityId === entityId));
    };
    refresh();
    window.addEventListener("khojney:bookmark-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("khojney:bookmark-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [entity, entityId]);

  function toggle() {
    const items = readBookmarks();
    const idx = items.findIndex((b) => b.entity === entity && b.entityId === entityId);
    if (idx >= 0) {
      writeBookmarks(items.filter((_, i) => i !== idx));
      setSaved(false);
      toast.success(`Removed ${entityName ?? "item"} from bookmarks`);
    } else {
      writeBookmarks([...items, { entity, entityId, name: entityName }]);
      setSaved(true);
      toast.success(`Saved ${entityName ?? "item"} to bookmarks`);
    }
  }

  // Avoid hydration mismatch — render a placeholder until mounted.
  if (!mounted) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("gap-1.5", className)}
        disabled
        aria-label="Save to bookmarks"
      >
        <Bookmark className="h-4 w-4" /> Save
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "secondary" : variant}
      size={size}
      onClick={toggle}
      className={cn("gap-1.5", className)}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save to bookmarks"}
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-4 w-4 text-primary" /> Saved
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" /> Save
        </>
      )}
    </Button>
  );
}
