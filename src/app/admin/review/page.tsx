import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { ReviewPanel } from "@/components/admin/review-panel";
export const dynamic = "force-dynamic";
export default async function ReviewPage() {
  const [gp,cq,dp,ue,uc] = await Promise.all([
    db.guestPost.findMany({where:{status:"PENDING"},orderBy:{createdAt:"desc"},include:{category:true}}),
    db.communityQuestion.findMany({where:{status:"PENDING"},orderBy:{createdAt:"desc"},include:{exam:{select:{title:true}},category:{select:{name:true}}}}),
    db.blogPost.findMany({where:{status:"DRAFT"},orderBy:{updatedAt:"desc"},include:{category:true,author:{select:{name:true}}}}),
    db.exam.count({where:{isPublished:false}}),
    db.college.count({where:{isPublished:false}}),
  ]);
  return (<div><BackToAdminLink href="/admin" label="Back" /><AdminFormHeader title="Content Review Center" description="Review content before it goes live." /><ReviewPanel stats={{pendingGuestPosts:gp.length,pendingQuestions:cq.length,draftBlogPosts:dp.length,unpublishedExams:ue,unpublishedColleges:uc,unpublishedBanks:0,unpublishedJobs:0,unpublishedGovtServices:0,totalReviews:0,totalComments:0}} guestPosts={gp.map(p=>({id:p.id,title:p.title,authorName:p.authorName,createdAt:p.createdAt.toISOString(),excerpt:p.excerpt??p.content.slice(0,150)}))} questions={cq.map(q=>({id:q.id,question:q.question,optionA:q.optionA,optionB:q.optionB,optionC:q.optionC,optionD:q.optionD,correctAnswer:q.correctAnswer,submitterName:q.submitterName,createdAt:q.createdAt.toISOString(),examTitle:q.exam?.title??null}))} draftPosts={dp.map(p=>({id:p.id,title:p.title,authorName:p.author?.name??"Unknown",updatedAt:p.updatedAt.toISOString(),categoryName:p.category?.name??null}))} unpublishedExams={[]} unpublishedColleges={[]} /></div>);
}
