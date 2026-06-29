import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { AiManagementPanel } from "@/components/admin/ai-management-panel";
export const dynamic = "force-dynamic";
export default async function AiManagementPage() {
  const today = new Date(new Date().setHours(0,0,0,0));
  const [ts,tm,tS,tM,ru,au] = await Promise.all([db.aiChatSession.count(),db.aiChatMessage.count(),db.aiChatSession.count({where:{createdAt:{gte:today}}}),db.aiChatMessage.count({where:{createdAt:{gte:today}}}),db.aiChatSession.count({where:{userId:{not:null}}}),db.aiChatSession.count({where:{userId:null}})]);
  const rs = await db.aiChatSession.findMany({orderBy:{updatedAt:"desc"},take:50,include:{user:{select:{name:true,email:true}},_count:{select:{messages:true}},messages:{orderBy:{createdAt:"desc"},take:2,select:{content:true,role:true,createdAt:true}}}});
  const rm = await db.aiChatMessage.findMany({where:{role:"user"},orderBy:{createdAt:"desc"},take:100,select:{content:true}});
  const freq: Record<string,number> = {}; for(const m of rm){const k=m.content.toLowerCase().slice(0,50);freq[k]=(freq[k]??0)+1;}
  const tq = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([q,c])=>({question:q,count:c}));
  return (<div><BackToAdminLink href="/admin" label="Back" /><AdminFormHeader title="AI Chat Management" description="Monitor AI conversations and usage." /><AiManagementPanel stats={{totalSessions:ts,totalMessages:tm,todaySessions:tS,todayMessages:tM,registeredUserSessions:ru,anonymousSessions:au}} recentSessions={rs.map(s=>({id:s.id,title:s.title,sessionUuid:s.sessionUuid,messageCount:s._count.messages,createdAt:s.createdAt.toISOString(),updatedAt:s.updatedAt.toISOString(),userId:s.userId,userName:s.user?.name??null,userEmail:s.user?.email??null,lastMessages:s.messages.map(m=>({role:m.role,content:m.content.slice(0,200),createdAt:m.createdAt.toISOString()}))}))} topQuestions={tq} /></div>);
}
