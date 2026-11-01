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
  Landmark,
  Briefcase,
  Building2,
  HeartPulse,
  Coins,
  LineChart,
  ShieldCheck,
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
    banks,
    jobs,
    government,
    hospitals,
    mutualFunds,
    nepseStocks,
    insurance,
  ] = await Promise.all([
    db.college.count(),
    db.school.count(),
    db.university.count(),
    db.scholarship.count(),
    db.exam.count(),
    db.blogPost.count(),
    db.user.count(),
    db.examAttempt.count(),
    db.bank.count(),
    db.job.count(),
    db.governmentService.count(),
    db.hospital.count(),
    db.mutualFund.count(),
    db.nepseStock.count(),
    db.insuranceCompany.count(),
  ]);

  return {
    colleges,
    schools,
    universities,
    scholarships,
    exams,
    posts,
    users,
    examAttempts,
    banks,
    jobs,
    government,
    hospitals,
    mutualFunds,
    nepseStocks,
    insurance,
  };
}

async function getRecentActivity() {
  const [
    colleges,
    schools,
    universities,
    scholarships,
    exams,
    posts,
    users,
    banks,
    jobs,
    government,
    hospitals,
    mutualFunds,
    nepseStocks,
    insurance,
  ] = await Promise.all([
    db.college.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
    db.school.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
    db.university.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
    db.scholarship.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, createdAt: true } }),
    db.exam.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, createdAt: true } }),
    db.blogPost.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, createdAt: true } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, email: true, createdAt: true } }),
    db.bank.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
    db.job.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, createdAt: true } }),
    db.governmentService.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, createdAt: true } }),
    db.hospital.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
    db.mutualFund.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
    db.nepseStock.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, symbol: true, companyName: true, createdAt: true } }),
    db.insuranceCompany.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } }),
  ]);

  type Activity = {
    id: string;
    label: string;
    type: string;
    href: string;
    createdAt: Date;
  };

  const all: Activity[] = [
    ...colleges.map((c) => ({ id: c.id, label: c.name, type: "College", href: `/admin/colleges/${c.id}`, createdAt: c.createdAt })),
    ...schools.map((s) => ({ id: s.id, label: s.name, type: "School", href: `/admin/schools/${s.id}`, createdAt: s.createdAt })),
    ...universities.map((u) => ({ id: u.id, label: u.name, type: "University", href: `/admin/universities/${u.id}`, createdAt: u.createdAt })),
    ...scholarships.map((s) => ({ id: s.id, label: s.title, type: "Scholarship", href: `/admin/scholarships/${s.id}`, createdAt: s.createdAt })),
    ...exams.map((e) => ({ id: e.id, label: e.title, type: "Exam", href: `/admin/exams/${e.id}`, createdAt: e.createdAt })),
    ...posts.map((p) => ({ id: p.id, label: p.title, type: "Blog Post", href: `/admin/blog/${p.id}`, createdAt: p.createdAt })),
    ...users.map((u) => ({ id: u.id, label: u.name ?? u.email, type: "User", href: `/admin/users`, createdAt: u.createdAt })),
    ...banks.map((b) => ({ id: b.id, label: b.name, type: "Bank", href: `/admin/banks/${b.id}`, createdAt: b.createdAt })),
    ...jobs.map((j) => ({ id: j.id, label: j.title, type: "Job", href: `/admin/jobs/${j.id}`, createdAt: j.createdAt })),
    ...government.map((g) => ({ id: g.id, label: g.title, type: "Govt Service", href: `/admin/government/${g.id}`, createdAt: g.createdAt })),
    ...hospitals.map((h) => ({ id: h.id, label: h.name, type: "Hospital", href: `/admin/hospitals/${h.id}`, createdAt: h.createdAt })),
    ...mutualFunds.map((m) => ({ id: m.id, label: m.name, type: "Mutual Fund", href: `/admin/mutual-funds/${m.id}`, createdAt: m.createdAt })),
    ...nepseStocks.map((n) => ({ id: n.id, label: `${n.symbol} - ${n.companyName}`, type: "Stock", href: `/admin/nepse/${n.id}`, createdAt: n.createdAt })),
    ...insurance.map((i) => ({ id: i.id, label: i.name, type: "Insurance", href: `/admin/insurance/${i.id}`, createdAt: i.createdAt })),
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
    { label: "Banks", value: stats.banks, href: "/admin/banks", icon: Landmark, color: "text-cyan-600 bg-cyan-50" },
    { label: "Jobs", value: stats.jobs, href: "/admin/jobs", icon: Briefcase, color: "text-yellow-600 bg-yellow-50" },
    { label: "Govt Services", value: stats.government, href: "/admin/government", icon: Building2, color: "text-indigo-600 bg-indigo-50" },
    { label: "Hospitals", value: stats.hospitals, href: "/admin/hospitals", icon: HeartPulse, color: "text-rose-600 bg-rose-50" },
    { label: "Mutual Funds", value: stats.mutualFunds, href: "/admin/mutual-funds", icon: Coins, color: "text-teal-600 bg-teal-50" },
    { label: "NEPSE Stocks", value: stats.nepseStocks, href: "/admin/nepse", icon: LineChart, color: "text-emerald-700 bg-emerald-50" },
    { label: "Insurance", value: stats.insurance, href: "/admin/insurance", icon: ShieldCheck, color: "text-blue-700 bg-blue-50" },
    { label: "Blog Posts", value: stats.posts, href: "/admin/blog", icon: Newspaper, color: "text-orange-600 bg-orange-50" },
    { label: "Users", value: stats.users, href: "/admin/users", icon: Users, color: "text-teal-600 bg-teal-50" },
    { label: "Exam Attempts", value: stats.examAttempts, href: "/admin/exams", icon: ListChecks, color: "text-slate-600 bg-slate-50" },
  ];

  const quickActions = [
    { label: "Add Hospital", href: "/admin/hospitals/new", icon: HeartPulse },
    { label: "Add Stock", href: "/admin/nepse/new", icon: LineChart },
    { label: "Add Mutual Fund", href: "/admin/mutual-funds/new", icon: Coins },
    { label: "Add Insurance", href: "/admin/insurance/new", icon: ShieldCheck },
    { label: "Add Bank", href: "/admin/banks/new", icon: Landmark },
    { label: "Add College", href: "/admin/colleges/new", icon: GraduationCap },
    { label: "Add Exam", href: "/admin/exams/new", icon: FileText },
    { label: "Add Blog Post", href: "/admin/blog/new", icon: Newspaper },
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
