import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { BulkUploadQuestions } from "@/components/admin/bulk-upload-questions";
export const dynamic = "force-dynamic";
export default async function BulkUploadPage() {
  const exams = await db.exam.findMany({where:{isPublished:true,isParent:false},select:{id:true,title:true,slug:true,parentId:true,parent:{select:{title:true}}},orderBy:{title:"asc"}});
  const grouped: Record<string, typeof exams> = {};
  for (const e of exams) { const p = e.parent?.title ?? "Standalone"; if(!grouped[p]) grouped[p]=[]; grouped[p].push(e); }
  return (<div><BackToAdminLink href="/admin" label="Back" /><AdminFormHeader title="Bulk Upload Questions" description="Upload questions via CSV/JSON with duplicate detection." /><BulkUploadQuestions groupedExams={grouped} /></div>);
}
