import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { CommunityHub } from "@/components/khojney/community-hub";
export const dynamic = "force-dynamic";
export default async function CommunityPage() {
  const user = await getSession();
  return (<AppShell user={user}><CommunityHub isLoggedIn={!!user} userName={user?.name??null} /></AppShell>);
}
