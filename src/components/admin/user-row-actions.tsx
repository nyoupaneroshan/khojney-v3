"use client";

import { useState, useTransition } from "react";
import { Loader2, MoreVertical, UserX, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { USER_ROLES } from "@/lib/constants";

interface Props {
  userId: string;
  role: string;
  userName: string;
  isCurrentUser: boolean;
  isSuperAdminTarget: boolean;
  canManageSuperAdmin: boolean;
}

const ROLE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  USER: "outline",
  EDITOR: "secondary",
  MODERATOR: "secondary",
  ADMIN: "default",
  SUPER_ADMIN: "destructive",
};

export function UserRowActions({
  userId,
  role,
  userName,
  isCurrentUser,
  isSuperAdminTarget,
  canManageSuperAdmin,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function changeRole(newRole: string) {
    if (newRole === role) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to update role");
        }
        toast.success(`${userName} is now ${newRole}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Update failed");
      }
    });
  }

  function deactivate() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to deactivate");
        }
        toast.success(`${userName} has been deactivated`);
        setOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Deactivation failed");
      }
    });
  }

  // Lock super-admin targets unless the current admin is also super-admin
  const roleLocked = isSuperAdminTarget && !canManageSuperAdmin;

  return (
    <div className="flex items-center gap-2">
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      <Select
        value={role}
        onValueChange={changeRole}
        disabled={isCurrentUser || roleLocked || pending}
      >
        <SelectTrigger className="h-8 w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {USER_ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              <Badge variant={ROLE_VARIANTS[r]} className="mr-1 text-[10px]">
                {r}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isCurrentUser}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem disabled className="text-xs">
            <Shield className="mr-2 h-3.5 w-3.5" /> Role: {role}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                variant="destructive"
                disabled={isCurrentUser || (isSuperAdminTarget && !canManageSuperAdmin)}
              >
                <UserX className="mr-2 h-3.5 w-3.5" /> Deactivate
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate {userName}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear the user&apos;s password hash, preventing them from logging in.
                  Their data (exam attempts, bookmarks, posts) will be preserved. This action can
                  be reverted by the user re-registering with the same email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deactivate}
                  disabled={pending}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {pending ? "Deactivating..." : "Deactivate User"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {!isCurrentUser && !isSuperAdminTarget && (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Use the dropdown to change role
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
