"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Search, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Exams", href: "/exams" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Building2, label: "Colleges", href: "/colleges" },
  { icon: User, label: "Account", href: "/dashboard" },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden">
      {MOBILE_NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 px-3 transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
