"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/khojney/theme-toggle";
import { GlobalSearchLauncher } from "@/components/khojney/global-search-launcher";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const NAV_LINKS: NavLink[] = [
  {
    label: "Education",
    href: "/exams",
    children: [
      { label: "Mock Exams", href: "/exams", description: "IOE, MBBS, CMAT, Loksewa & more" },
      { label: "Colleges", href: "/colleges", description: "Engineering, Medical, Management colleges" },
      { label: "Schools", href: "/schools", description: "Secondary & +2 schools" },
      { label: "Universities", href: "/universities", description: "All Nepali universities" },
      { label: "Scholarships", href: "/scholarships", description: "Local & international scholarships" },
      { label: "Blog", href: "/blog", description: "Exam guides & career tips" },
    ],
  },
  {
    label: "Finance",
    href: "/banks",
    children: [
      { label: "Banks of Nepal", href: "/banks", description: "Compare interest rates & services" },
      { label: "Govt Services", href: "/government?category=TAX", description: "PAN, VAT, tax filing" },
    ],
  },
  { label: "Careers", href: "/jobs" },
  {
    label: "Government",
    href: "/government",
    children: [
      { label: "All Services", href: "/government", description: "Citizenship, passport, PAN, license" },
      { label: "Citizenship", href: "/government?category=CITIZENSHIP", description: "Nagarikta application" },
      { label: "Passport", href: "/government?category=PASSPORT", description: "MRP / e-Passport" },
      { label: "Driving License", href: "/government?category=LICENSE", description: "Apply & renew" },
      { label: "PAN / VAT", href: "/government?category=PAN", description: "Tax registration" },
      { label: "Loksewa Exams", href: "/exams?category=loksewa", description: "Public Service Commission" },
    ],
  },
  { label: "Compare", href: "/compare" },
  { label: "Directory", href: "/colleges" },
];

interface HeaderProps {
  user?: { id: string; name: string | null; email: string; role: string } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Logo />
                  <span className="text-xl font-bold">Khojney</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <div key={`${link.label}-${link.href}`} className="flex flex-col">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-base font-medium hover:bg-accent",
                      isActive(link.href) && "text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="ml-3 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="hidden sm:block text-xl font-bold tracking-tight">
            Khojney<span className="text-primary">.com</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <DropdownMenu key={`${link.label}-${link.href}`}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1 font-medium",
                      isActive(link.href) && "text-primary"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  {link.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href} className="flex flex-col items-start">
                        <span className="font-medium">{child.label}</span>
                        {child.description && (
                          <span className="text-xs text-muted-foreground">{child.description}</span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={`${link.label}-${link.href}`}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "font-medium",
                  isActive(link.href) && "text-primary"
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            )
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <GlobalSearchLauncher />

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {user.name ?? user.email}
                  </span>
                  {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                    <Badge variant="secondary" className="hidden md:inline">Admin</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name ?? "User"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                </DropdownMenuItem>
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/";
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login?mode=register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
      K
    </div>
  );
}
