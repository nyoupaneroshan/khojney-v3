import { cn } from "@/lib/utils";

interface EntityBadgeProps {
  value?: string | null;
  variant?: "default" | "outline" | "secondary" | "destructive";
  className?: string;
  children?: React.ReactNode;
}

/**
 * Tiny wrapper around Badge that skips rendering when value is empty,
 * so list/detail pages don't have to repeatedly null-check.
 */
import { Badge } from "@/components/ui/badge";

export function EntityBadge({ value, variant = "outline", className, children }: EntityBadgeProps) {
  if (!value && !children) return null;
  return (
    <Badge variant={variant} className={cn("text-xs", className)}>
      {children ?? value}
    </Badge>
  );
}
