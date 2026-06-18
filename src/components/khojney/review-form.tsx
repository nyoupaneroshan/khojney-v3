"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  entity: "COLLEGE" | "SCHOOL" | "UNIVERSITY" | "SCHOLARSHIP";
  entityId: string;
  /** Slug of the entity (for redirect after submit if needed). */
  entitySlug?: string;
  /** Whether the current user is logged in. */
  isLoggedIn: boolean;
  /** Detail page path for redirect on success. */
  redirectPath?: string;
}

/**
 * Client-side review submission form.
 * POSTs to /api/reviews — the API itself is built by another agent.
 * Shows toast on success and refreshes the page so the new review appears.
 */
export function ReviewForm({
  entity,
  entityId,
  isLoggedIn,
  redirectPath,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border bg-muted/30 p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold">Sign in to leave a review</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Help other students by sharing your experience.
        </p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/login?mode=register">Sign in to review</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity,
          entityId,
          rating,
          title: title.trim() || null,
          comment: comment.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to submit review");
      }
      toast.success("Review submitted. Thank you!");
      setTitle("");
      setComment("");
      setRating(0);
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Your rating</Label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hover || rating) >= star
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/40",
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {rating} / 5
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-title">Title (optional)</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-comment">Your review</Label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details about academics, facilities, faculty, campus life..."
          rows={4}
          maxLength={1000}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  );
}
