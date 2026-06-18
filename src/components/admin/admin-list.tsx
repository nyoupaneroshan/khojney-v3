"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { Plus, Search, Pencil, Trash2, Loader2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export interface AdminListColumn {
  label: string;
  className?: string;
}

export interface AdminListRow {
  /** Unique id used for the React key and the DELETE call. */
  id: string;
  /** Pre-rendered cell contents (one per column). The actions column is appended automatically. */
  cells: ReactNode[];
}

interface AdminListProps {
  title: string;
  description?: string;
  columns: AdminListColumn[];
  rows: AdminListRow[];
  total: number;
  page: number;
  pageSize: number;
  basePath: string; // e.g. "/admin/colleges"
  apiPath: string; // e.g. "/api/admin/colleges"
  searchPlaceholder?: string;
  searchQuery?: string;
  newLabel?: string;
  emptyMessage?: string;
}

export function AdminList({
  title,
  description,
  columns,
  rows,
  total,
  page,
  pageSize,
  basePath,
  apiPath,
  searchPlaceholder = "Search...",
  searchQuery = "",
  newLabel = "Add new",
  emptyMessage = "No records found.",
}: AdminListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery);
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("q", search);
    else params.delete("q");
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${basePath}?${params.toString()}`);
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to delete");
        }
        toast.success("Deleted successfully");
        setDeletingId(null);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button asChild>
          <Link href={`${basePath}/new`}>
            <Plus className="h-4 w-4" /> {newLabel}
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSearch} className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
                aria-label="Search records"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("q");
                  params.delete("page");
                  router.push(`${basePath}?${params.toString()}`);
                }}
              >
                Clear
              </Button>
            )}
          </form>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col, idx) => (
                    <TableHead key={idx} className={col.className}>
                      {col.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell, idx) => (
                        <TableCell key={idx} className={columns[idx]?.className}>
                          {cell}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                            <Link href={`${basePath}/${row.id}`} aria-label="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <AlertDialog
                            open={deletingId === row.id}
                            onOpenChange={(open) => setDeletingId(open ? row.id : null)}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                aria-label="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The record will be permanently
                                  removed from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(row.id)}
                                  disabled={pending}
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                  {pending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{from}</span>–
              <span className="font-medium">{to}</span> of{" "}
              <span className="font-medium">{total}</span> records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** Small back-link used on create/edit pages. */
export function BackToAdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
      <Link href={href}>
        <ArrowLeft className="h-4 w-4" /> {label}
      </Link>
    </Button>
  );
}

/** Page header used on create/edit pages. */
export function AdminFormHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
