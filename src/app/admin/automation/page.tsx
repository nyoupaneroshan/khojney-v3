import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { AutomationPanel } from "@/components/admin/automation-panel";
export const dynamic = "force-dynamic";
export default async function AutomationPage() {
  const webhooks = await db.webhook.findMany({orderBy:{createdAt:"desc"},include:{_count:{select:{logs:true}},logs:{orderBy:{createdAt:"desc"},take:5,select:{id:true,event:true,success:true,statusCode:true,createdAt:true,response:true}}}});
  return (<div><BackToAdminLink href="/admin" label="Back" /><AdminFormHeader title="Automation & Webhooks" description="Connect to n8n, Zapier, or any HTTP endpoint." /><AutomationPanel webhooks={webhooks} /></div>);
}
