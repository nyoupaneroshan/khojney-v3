"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface FiltersShellProps {
  /** The actual filter form contents. Must include a submit button or rely on auto-submit selects. */
  children: React.ReactNode;
  /** Title for the mobile sheet trigger. */
  title?: string;
  /** Count of active filters, displayed as a badge. */
  activeCount?: number;
}

/**
 * Layout shell for list-page filters.
 * - Desktop: renders children in a left `<aside>` (sticky).
 * - Mobile: renders a Sheet with a "Filters" trigger button.
 *
 * The actual filter inputs are passed as children by each module page.
 * Filters use plain HTML `<form>` (or auto-submitting selects) so they
 * update the URL via `router.push`, then the server page re-renders.
 */
export function FiltersShell({ children, title = "Filters", activeCount = 0 }: FiltersShellProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {title}
              {activeCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">{children}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{title}</h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {activeCount} active
              </span>
            )}
          </div>
          {children}
        </div>
      </aside>
    </>
  );
}

/**
 * Link-based button that resets to the base path (clears all filters).
 * Works in both mobile sheet + desktop sidebar.
 */
export function ClearFiltersLink({ basePath }: { basePath: string }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-center text-xs"
      onClick={() => router.push(basePath)}
    >
      Clear all filters
    </Button>
  );
}
