import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Sidebar-style info card used on detail pages (contact info, key facts, etc.).
 */
export function InfoCard({ title, className, children }: InfoCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(!title && "pt-6")}>{children}</CardContent>
    </Card>
  );
}

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * A label + value pair stacked in a column, used inside InfoCard.
 */
export function InfoRow({ label, value, icon }: InfoRowProps) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-start gap-3 py-2">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground break-words">{value}</div>
      </div>
    </div>
  );
}
