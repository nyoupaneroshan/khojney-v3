import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** 0..5 (supports fractions). */
  rating: number;
  /** Total review count to display alongside stars. */
  count?: number;
  /** Size of each star icon in px. */
  size?: number;
  /** Show numeric rating value next to stars. */
  showValue?: boolean;
  className?: string;
}

/**
 * Read-only star rating display. Uses partial fills via overlapping two
 * layers of stars so we can show fractional ratings (e.g. 4.3).
 */
export function StarRating({
  rating,
  count,
  size = 16,
  showValue = true,
  className,
}: StarRatingProps) {
  const safeRating = Math.max(0, Math.min(5, rating || 0));
  const pct = (safeRating / 5) * 100;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative inline-flex" aria-label={`Rating: ${safeRating.toFixed(1)} out of 5`}>
        {/* Background (empty) stars */}
        <div className="flex text-muted-foreground/30">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} style={{ width: size, height: size }} className="fill-current" />
          ))}
        </div>
        {/* Foreground (filled) stars — clipped to % */}
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-400"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              style={{ width: size, height: size, minWidth: size }}
              className="fill-current"
            />
          ))}
        </div>
      </div>
      {showValue && (
        <span className="text-xs font-medium text-foreground">{safeRating.toFixed(1)}</span>
      )}
      {typeof count === "number" && count > 0 && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
