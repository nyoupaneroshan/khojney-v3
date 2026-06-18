import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  School,
  University as UniversityIcon,
  Award,
  FileText,
  Newspaper,
  Users,
  ListChecks,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { formatDateTime } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface StatItem {
  label: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

async function getStats() {
  const [
    colleges,
    schools,
    universities,
    scholarships,
    exams,
    posts,
    users,
    examAttempts,
  ] = await Promise.all([
    db.college.count(),
    db.school.count(),
    db.university.count(),
    db.scholarship.count(),
    db.exam.count(),
    db.blogPost.count(),
    db.user.count(),
    db.examAttempt.count(),
  ]);

  return { colleges, schools, universities, scholarships, exams, posts, users, examAttempts };
}

async function getRecentActivity() {
  // Fetch latest 10 records from each module, then merge and sort by createdAt.
  const [colleges, schools, universities, scholarships, exams, posts, users] =
    await Promise.all([
      db.college.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
      db.school.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
      db.university.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
      db.scholarship.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      db.exam.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      db.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
    ]);

  type Activity = {
    id: string;
    label: string;
    type: string;
    href: string;
    createdAt: Date;
  };

  const all: Activity[] = [
    ...colleges.map((c) => ({
      id: c.id,
      label: c.name,
      type: "College",
      href: `/admin/colleges/${c.id}`,
      createdAt: c.createdAt,
    })),
    ...schools.map((s) => ({
      id: s.id,
      label: s.name,
      type: "School",
      href: `/admin/schools/${s.id}`,
      createdAt: s.createdAt,
    })),
    ...universities.map((u) => ({
      id: u.id,
      label: u.name,
      type: "University",
      href: `/admin/universities/${u.id}`,
      createdAt: u.createdAt,
    })),
    ...scholarships.map((s) => ({
      id: s.id,
      label: s.title,
      type: "Scholarship",
      href: `/admin/scholarships/${s.id}`,
      createdAt: s.createdAt,
    })),
    ...exams.map((e) => ({
      id: e.id,
      label: e.title,
      type: "Exam",
      href: `/admin/exams/${e.id}`,
      createdAt: e.createdAt,
    })),
    ...posts.map((p) => ({
      id: p.id,
      label: p.title,
      type: "Blog Post",
      href: `/admin/blog/${p.id}`,
      createdAt: p.createdAt,
    })),
    ...users.map((u) => ({
      id: u.id,
      label: u.name ?? u.email,
      type: "User",
      href: `/admin/users`,
      createdAt: u.createdAt,
    })),
  ];

  return all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
}

export default async function AdminDashboardPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentActivity()]);

  const statItems: StatItem[] = [
    { label: "Colleges", value: stats.colleges, href: "/admin/colleges", icon: GraduationCap, color: "text-red-600 bg-red-50" },
    { label: "Schools", value: stats.schools, href: "/admin/schools", icon: School, color: "text-blue-600 bg-blue-50" },
    { label: "Universities", value: stats.universities, href: "/admin/universities", icon: UniversityIcon, color: "text-purple-600 bg-purple-50" },
    { label: "Scholarships", value: stats.scholarships, href: "/admin/scholarships", icon: Award, color: "text-emerald-600 bg-emerald-50" },
    { label: "Exams", value: stats.exams, href: "/admin/exams", icon: FileText, color: "text-amber-600 bg-amber-50" },
    { label: "Blog Posts", value: stats.posts, href: "/admin/blog", icon: Newspaper, color: "text-orange-600 bg-orange-50" },
    { label: "Users", value: stats.users, href: "/admin/users", icon: Users, color: "text-teal-600 bg-teal-50" },
    { label: "Exam Attempts", value: stats.examAttempts, href: "/admin/exams", icon: ListChecks, color: "text-rose-600 bg-rose-50" },
  ];

  const quickActions = [
    { label: "Add College", href: "/admin/colleges/new", icon: GraduationCap },
    { label: "Add Exam", href: "/admin/exams/new", icon: FileText },
    { label: "Add Blog Post", href: "/admin/blog/new", icon: Newspaper },
    { label: "Add Scholarship", href: "/admin/scholarships/new", icon: Award },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of all platform content and recent activity.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Latest 10 records created across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {recent.length === 0 && (
                <li className="text-sm text-muted-foreground text-center py-6">
                  No activity yet.
                </li>
              )}
              {recent.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 text-sm py-2 border-b border-border/50 last:border-0"
                >
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                    {item.type}
                  </Badge>
                  <Link
                    href={item.href}
                    className="flex-1 truncate font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDateTime(item.createdAt)}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump straight to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.href}
                  asChild
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                >
                  <Link href={action.href}>
                    <Icon className="h-4 w-4 mr-2 text-primary" />
                    <span className="flex-1 text-left">{action.label}</span>
                    <Plus className="h-3.5 w-3.5 ml-auto" />
                  </Link>
                </Button>
              );
            })}
            <Button asChild variant="ghost" className="w-full justify-between mt-2">
              <Link href="/admin/categories">
                Manage Categories <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/admin/trending">
                Manage Trending <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href="/admin/users">
                Manage Users <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
