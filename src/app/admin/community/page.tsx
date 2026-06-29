import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { CommunityAdmin } from "@/components/admin/community-admin";
export const dynamic = "force-dynamic";
export default async function CommunityAdminPage() {
  const [gp,cq] = await Promise.all([db.guestPost.findMany({orderBy:{createdAt:"desc"},include:{category:true}}),db.communityQuestion.findMany({orderBy:{createdAt:"desc"},include:{exam:{select:{title:true}},category:{select:{name:true}}}})]);
  return (<div><BackToAdminLink href="/admin" label="Back" /><AdminFormHeader title="Community Management" description="Review guest posts and community questions." /><CommunityAdmin guestPosts={gp as any} communityQuestions={cq as any} /></div>);
}
