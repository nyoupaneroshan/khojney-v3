"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Bookmark,
  History,
  Award,
  Bell,
  Trophy,
  FileText,
  TrendingUp,
  ExternalLink,
  Trash2,
  Flag,
  BookOpen,
  Compass,
  Star,
  Bookmark as BookmarkIcon,
  CheckCircle2,
  Info,
  AlertTriangle,
  CheckCheck,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardStats {
  examsTaken: number;
  avgScore: number;
  bookmarksCount: number;
  certificatesCount: number;
}

interface AttemptItem {
  id: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  durationSec: number | null;
  rank: number | null;
  finishedAt: string | null;
  exam: { title: string; slug: string };
}

interface BookmarkItem {
  id: string;
  entity: string;
  entityId: string;
  createdAt: string;
  data: {
    title: string;
    slug?: string;
    description?: string;
    image?: string | null;
    meta?: string;
  } | null;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

interface DashboardTabsProps {
  stats: DashboardStats;
  attempts: AttemptItem[];
  bookmarks: BookmarkItem[];
  achievements: Achievement[];
  notifications: NotificationItem[];
  unreadCount: number;
  user: { name: string | null; email: string };
}

const ENTITY_META: Record<string, { label: string; path: string; icon: React.ComponentType<{ className?: string }> }> = {
  EXAM: { label: "Exam", path: "/exams", icon: FileText },
  COLLEGE: { label: "College", path: "/colleges", icon: Trophy },
  SCHOOL: { label: "School", path: "/schools", icon: BookOpen },
  UNIVERSITY: { label: "University", path: "/universities", icon: Compass },
  SCHOLARSHIP: { label: "Scholarship", path: "/scholarships", icon: Award },
  POST: { label: "Article", path: "/blog", icon: BookOpen },
};

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Flag,
  BookOpen,
  Trophy,
  Compass,
  Star,
  Award,
  Bookmark: BookmarkIcon,
  BookmarkCheck: BookmarkIcon,
};

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  EXAM_RESULT: Trophy,
};

export function DashboardTabs({
  stats,
  attempts,
  bookmarks,
  achievements,
  notifications,
  unreadCount,
  user,
}: DashboardTabsProps) {
  const [tab, setTab] = useState("overview");
  const [notificationState, setNotificationState] = useState(notifications);
  const [isPending, startTransition] = useTransition();

  const markAsRead = (id: string, link?: string | null) => {
    const notif = notificationState.find((n) => n.id === id);
    if (!notif) return;
    if (!notif.read) {
      // Optimistic update
      setNotificationState((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      startTransition(async () => {
        try {
          const res = await fetch(`/dashboard/api/notifications/${id}`, {
            method: "PATCH",
          });
          if (!res.ok) throw new Error("Failed to mark as read");
        } catch {
          // Revert on failure
          setNotificationState((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
          );
          toast.error("Could not mark as read");
        }
      });
    }
    if (link) {
      window.location.href = link;
    }
  };

  const deleteNotification = (id: string) => {
    const prev = notificationState;
    setNotificationState((curr) => curr.filter((n) => n.id !== id));
    startTransition(async () => {
      try {
        const res = await fetch(`/dashboard/api/notifications/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Notification deleted");
      } catch {
        setNotificationState(prev);
        toast.error("Could not delete notification");
      }
    });
  };

  const markAllAsRead = () => {
    const unread = notificationState.filter((n) => !n.read);
    if (unread.length === 0) return;
    setNotificationState((curr) => curr.map((n) => ({ ...n, read: true })));
    startTransition(async () => {
      try {
        await Promise.all(
          unread.map((n) =>
            fetch(`/dashboard/api/notifications/${n.id}`, { method: "PATCH" }),
          ),
        );
        toast.success("All notifications marked as read");
      } catch {
        toast.error("Could not mark all as read");
      }
    });
  };

  const unread = notificationState.filter((n) => !n.read).length;

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="w-full justify-start flex-wrap h-auto py-1 gap-1">
        <TabsTrigger value="overview" className="gap-1.5">
          <LayoutDashboard className="h-3.5 w-3.5" /> Overview
        </TabsTrigger>
        <TabsTrigger value="saved" className="gap-1.5">
          <Bookmark className="h-3.5 w-3.5" /> Saved
          <span className="ml-1 text-xs text-muted-foreground">({bookmarks.length})</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-1.5">
          <History className="h-3.5 w-3.5" /> Exam History
          <span className="ml-1 text-xs text-muted-foreground">({attempts.length})</span>
        </TabsTrigger>
        <TabsTrigger value="achievements" className="gap-1.5">
          <Award className="h-3.5 w-3.5" /> Achievements
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-1.5 relative">
          <Bell className="h-3.5 w-3.5" /> Notifications
          {unread > 0 && (
            <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview" className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="Exams Taken"
            value={String(stats.examsTaken)}
            color="bg-red-100 text-red-700"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg Score"
            value={`${stats.avgScore}%`}
            color="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={<Bookmark className="h-5 w-5" />}
            label="Bookmarks"
            value={String(stats.bookmarksCount)}
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            label="Completed"
            value={String(stats.certificatesCount)}
            color="bg-amber-100 text-amber-700"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Recent Exams
              </CardTitle>
              <CardDescription>Your 5 most recent attempts.</CardDescription>
            </CardHeader>
            <CardContent>
              {attempts.length === 0 ? (
                <EmptyState
                  title="No exams yet"
                  desc="Take your first mock exam to see history here."
                  cta={{ label: "Browse exams", href: "/exams" }}
                />
              ) : (
                <ul className="space-y-2">
                  {attempts.slice(0, 5).map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/exams/${a.exam.slug}`}
                        className="flex items-center justify-between gap-3 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{a.exam.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.finishedAt
                              ? new Date(a.finishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                            {a.rank && ` · Rank #${a.rank}`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">
                            {a.score}/{a.totalMarks}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((a.score / a.totalMarks) * 100)}%
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Recent Notifications
              </CardTitle>
              <CardDescription>Latest updates from Khojney.</CardDescription>
            </CardHeader>
            <CardContent>
              {notificationState.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No notifications yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {notificationState.slice(0, 5).map((n) => {
                    const Icon = NOTIFICATION_ICONS[n.type] ?? Info;
                    return (
                      <li
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors",
                          !n.read && "border-primary/40 bg-primary/5",
                        )}
                        onClick={() => markAsRead(n.id, n.link ?? undefined)}
                      >
                        <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        </div>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {notificationState.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setTab("notifications")}
                >
                  View all notifications
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Saved */}
      <TabsContent value="saved" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" /> Saved Items
            </CardTitle>
            <CardDescription>
              You have {bookmarks.length} saved item{bookmarks.length !== 1 ? "s" : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookmarks.length === 0 ? (
              <EmptyState
                title="No bookmarks yet"
                desc="Save exams, colleges, scholarships, or articles to find them here."
                cta={{ label: "Explore", href: "/exams" }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {bookmarks.map((b) => {
                  const meta = ENTITY_META[b.entity] ?? ENTITY_META.EXAM;
                  const Icon = meta.icon;
                  const url = b.data?.slug ? `${meta.path}/${b.data.slug}` : meta.path;
                  return (
                    <Link
                      key={b.id}
                      href={url}
                      className="flex items-start gap-3 rounded-lg border p-3 hover:border-primary/30 hover:bg-accent/30 transition-colors group"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="outline" className="text-xs">{meta.label}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(b.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                          {b.data?.title ?? "Untitled"}
                        </p>
                        {b.data?.meta && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {b.data.meta}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Exam History */}
      <TabsContent value="history" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Exam History
            </CardTitle>
            <CardDescription>
              All your past exam attempts, newest first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <EmptyState
                title="No exam attempts yet"
                desc="Take a mock exam to see your scores and ranks here."
                cta={{ label: "Browse exams", href: "/exams" }}
              />
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b">
                      <th className="py-2 pr-3 font-medium">Exam</th>
                      <th className="py-2 px-3 font-medium">Score</th>
                      <th className="py-2 px-3 font-medium">%</th>
                      <th className="py-2 px-3 font-medium">Correct</th>
                      <th className="py-2 px-3 font-medium">Wrong</th>
                      <th className="py-2 px-3 font-medium">Time</th>
                      <th className="py-2 px-3 font-medium">Rank</th>
                      <th className="py-2 pl-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((a) => {
                      const pct = Math.round((a.score / a.totalMarks) * 100);
                      const pctColor =
                        pct >= 80
                          ? "text-emerald-600"
                          : pct >= 50
                            ? "text-amber-600"
                            : "text-destructive";
                      return (
                        <tr key={a.id} className="border-b last:border-b-0 hover:bg-accent/30">
                          <td className="py-2.5 pr-3">
                            <Link
                              href={`/exams/${a.exam.slug}`}
                              className="font-medium hover:text-primary"
                            >
                              {a.exam.title}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {a.score}/{a.totalMarks}
                          </td>
                          <td className={cn("py-2.5 px-3 font-semibold", pctColor)}>{pct}%</td>
                          <td className="py-2.5 px-3 text-emerald-600">{a.correctCount}</td>
                          <td className="py-2.5 px-3 text-destructive">{a.wrongCount}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {a.durationSec
                              ? `${Math.floor(a.durationSec / 60)}m ${a.durationSec % 60}s`
                              : "—"}
                          </td>
                          <td className="py-2.5 px-3">
                            {a.rank ? (
                              <Badge variant="secondary">#{a.rank}</Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-2.5 pl-3 text-muted-foreground text-xs">
                            {a.finishedAt
                              ? new Date(a.finishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Achievements */}
      <TabsContent value="achievements" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Achievements
            </CardTitle>
            <CardDescription>
              You&rsquo;ve unlocked{" "}
              <span className="font-semibold text-foreground">
                {achievements.filter((a) => a.unlocked).length}
              </span>{" "}
              of {achievements.length} badges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((a) => {
                const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Award;
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "rounded-lg border p-4 flex items-start gap-3 transition-all",
                      a.unlocked
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-muted/30 opacity-70",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                        a.unlocked
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {a.unlocked ? <Icon className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{a.title}</p>
                        {a.unlocked && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                      <p className="text-xs mt-1.5">
                        {a.unlocked ? (
                          <span className="text-emerald-600 font-medium">Unlocked</span>
                        ) : (
                          <span className="text-muted-foreground">Locked</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" /> Notifications
                </CardTitle>
                <CardDescription>
                  {unread > 0
                    ? `You have ${unread} unread notification${unread !== 1 ? "s" : ""}.`
                    : "All caught up!"}
                </CardDescription>
              </div>
              {unread > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={isPending}>
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notificationState.length === 0 ? (
              <EmptyState
                title="No notifications"
                desc="You'll see updates about your exams, bookmarks, and more here."
              />
            ) : (
              <ul className="space-y-2">
                {notificationState.map((n) => {
                  const Icon = NOTIFICATION_ICONS[n.type] ?? Info;
                  return (
                    <li
                      key={n.id}
                      className={cn(
                        "group flex items-start gap-3 rounded-lg border p-3 transition-colors",
                        !n.read
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-card",
                        n.link && "cursor-pointer hover:bg-accent/40",
                      )}
                      onClick={() => markAsRead(n.id, n.link ?? undefined)}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          n.read
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/15 text-primary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{n.title}</p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(n.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {n.link && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = n.link!;
                            }}
                            aria-label="Open"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", color)}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  desc,
  cta,
}: {
  title: string;
  desc: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-8">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      {cta && (
        <Button asChild size="sm" className="mt-3">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      )}
    </div>
  );
}
