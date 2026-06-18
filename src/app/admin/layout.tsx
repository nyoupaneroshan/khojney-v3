import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth-server";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    redirect("/login?callbackUrl=/admin");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
