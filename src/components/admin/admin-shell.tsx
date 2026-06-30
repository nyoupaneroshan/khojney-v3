"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  School,
  University as UniversityIcon,
  Award,
  FileText,
  Newspaper,
  FolderTree,
  TrendingUp,
  Users,
  Building2,
  Landmark,
  Briefcase,
  HeartPulse,
  ShieldCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
  Menu,
  Search,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Colleges", href: "/admin/colleges", icon: GraduationCap },
  { label: "Schools", href: "/admin/schools", icon: School },
  { label: "Universities", href: "/admin/universities", icon: UniversityIcon },
  { label: "Scholarships", href: "/admin/scholarships", icon: Award },
  { label: "Exams", href: "/admin/exams", icon: FileText },
  { label: "Banks", href: "/admin/banks", icon: Landmark },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Government Services", href: "/admin/government", icon: Building2 },
  { label: "Blog Posts", href: "/admin/blog", icon: Newspaper },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Trending Searches", href: "/admin/trending", icon: TrendingUp },
  { label: "Users", href: "/admin/users", icon: Users },
];

const COMING_SOON: NavItem[] = [
  { label: "Hospitals", href: "#", icon: HeartPulse, disabled: true },
  { label: "Mutual Funds", href: "#", icon: TrendingUp, disabled: true },
  { label: "NEPSE / Share Market", href: "#", icon: TrendingUp, disabled: true },
  { label: "Insurance", href: "#", icon: ShieldCheck, disabled: true },
];

const ROUTE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/colleges": "Colleges",
  "/admin/schools": "Schools",
  "/admin/universities": "Universities",
  "/admin/scholarships": "Scholarships",
  "/admin/exams": "Exams",
  "/admin/banks": "Banks",
  "/admin/jobs": "Jobs",
  "/admin/government": "Government Services",
  "/admin/blog": "Blog Posts",
  "/admin/categories": "Categories",
  "/admin/trending": "Trending Searches",
  "/admin/users": "Users",
};

const SINGULAR: Record<string, string> = {
  Colleges: "College",
  Schools: "School",
  Universities: "University",
  Scholarships: "Scholarship",
  Exams: "Exam",
  Banks: "Bank",
  Jobs: "Job",
  "Government Services": "Government Service",
  "Blog Posts": "Blog Post",
  Categories: "Category",
  "Trending Searches": "Trending Search",
  Users: "User",
};

function getRouteTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  const matched = Object.keys(ROUTE_TITLES)
    .filter((key) => pathname.startsWith(key + "/") || pathname === key)
    .sort((a, b) => b.length - a.length)[0];
  if (matched) {
    const rest = pathname.slice(matched.length);
    const singular = SINGULAR[ROUTE_TITLES[matched]] ?? ROUTE_TITLES[matched].replace(/s$/, "");
    if (rest === "/new") return `New ${singular}`;
    if (/^\/[^/]+$/.test(rest)) return `Edit ${singular}`;
    return ROUTE_TITLES[matched];
  }
  return "Admin";
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Admin navigation">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}

      <div className="px-3 pt-6 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Phase 2
      </div>
      {COMING_SOON.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
            aria-disabled="true"
            title="Coming soon"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            <Badge variant="outline" className="ml-auto text-[10px] py-0 px-1.5">
              Soon
            </Badge>
          </div>
        );
      })}
    </nav>
  );
}

function Logo() {
  return (
    <Link href="/admin" className="flex items-center gap-2 px-4 h-16 border-b border-border">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
        K
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight">
          Khojney <span className="text-primary">Admin</span>
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Control Panel
        </span>
      </div>
    </Link>
  );
}

function UserMenu({ user }: { user: AdminUser }) {
  const router = useRouter();
  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-10 px-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium max-w-[140px] truncate">
              {user.name ?? user.email}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">{user.role}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name ?? "Admin User"}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <Badge variant="secondary" className="mt-1 w-fit text-[10px] uppercase">
              {user.role}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" /> View Public Site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
            router.refresh();
          }}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AdminShellProps {
  user: AdminUser;
  children: ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getRouteTitle(pathname);

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-border bg-card">
        <Logo />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav pathname={pathname} />
        </div>
        <div className="border-t border-border p-3">
          <Button variant="outline" size="sm" asChild className="w-full justify-start">
            <Link href="/">
              <ExternalLink className="mr-2 h-4 w-4" /> Back to site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
          <SheetHeader className="p-0">
            <SheetTitle className="p-0 m-0">
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="border-t border-border p-3">
            <Button variant="outline" size="sm" asChild className="w-full justify-start">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <ExternalLink className="mr-2 h-4 w-4" /> Back to site
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 backdrop-blur px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold tracking-tight truncate">{pageTitle}</h1>

          <div className="ml-auto flex items-center gap-2">
            <form
              action="/search"
              className="hidden md:flex items-center relative"
              aria-label="Search site"
            >
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                name="q"
                placeholder="Search site..."
                className="w-56 pl-9 h-9 bg-background"
                aria-label="Search"
              />
            </form>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <UserMenu user={user} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
