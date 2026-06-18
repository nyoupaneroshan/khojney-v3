import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { formatDateTime } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; role?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await getSession();
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 25;
  const q = (sp.q ?? "").trim();
  const roleFilter = sp.role;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { location: { contains: q } },
    ];
  }
  if (roleFilter) where.role = roleFilter;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        location: true,
        createdAt: true,
        passwordHash: true,
        _count: { select: { examAttempts: true, bookmarks: true, posts: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function goToPage(p: number, search: string, role: string) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (role) params.set("role", role);
    params.set("page", String(p));
    return `/admin/users?${params.toString()}`;
  }

  const canManageSuperAdmin = session?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View all registered users and manage their roles. Deactivated users can&apos;t log in
          with a password.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
            <form
              action="/admin/users"
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search by name, email, location..."
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
            <form action="/admin/users" className="flex items-center gap-2">
              <input type="hidden" name="q" value={q} />
              <select
                name="role"
                defaultValue={roleFilter ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All roles</option>
                <option value="USER">USER</option>
                <option value="EDITOR">EDITOR</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <Button type="submit" variant="outline" size="sm">
                Filter
              </Button>
            </form>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const isCurrentUser = session?.id === user.id;
                    const isSuperAdminTarget = user.role === "SUPER_ADMIN";
                    const isActive = Boolean(user.passwordHash);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name ?? "Unnamed"}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "SUPER_ADMIN"
                                ? "destructive"
                                : user.role === "ADMIN"
                                  ? "default"
                                  : user.role === "USER"
                                    ? "outline"
                                    : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.location ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs text-muted-foreground">
                            <span>{user._count.examAttempts} exam attempts</span>
                            <span>{user._count.bookmarks} bookmarks</span>
                            <span>{user._count.posts} posts</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isCurrentUser ? (
                            <Badge variant="default">You</Badge>
                          ) : isActive ? (
                            <Badge variant="secondary">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <UserRowActions
                            userId={user.id}
                            role={user.role}
                            userName={user.name ?? user.email}
                            isCurrentUser={isCurrentUser}
                            isSuperAdminTarget={isSuperAdminTarget}
                            canManageSuperAdmin={canManageSuperAdmin}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{total === 0 ? 0 : (page - 1) * pageSize + 1}</span>
              –<span className="font-medium">{Math.min(total, page * pageSize)}</span> of{" "}
              <span className="font-medium">{total}</span> users
            </p>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" disabled={page <= 1}>
                <Link
                  href={goToPage(Math.max(1, page - 1), q, roleFilter ?? "")}
                  aria-disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
                <Link
                  href={goToPage(Math.min(totalPages, page + 1), q, roleFilter ?? "")}
                  aria-disabled={page >= totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
