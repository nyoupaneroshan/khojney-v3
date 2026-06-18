import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItemData[];
  className?: string;
}

/**
 * Reusable breadcrumb navigation used on list + detail pages.
 * The last item is rendered as the current page (non-clickable).
 */
export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  if (!items.length) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="line-clamp-1">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
