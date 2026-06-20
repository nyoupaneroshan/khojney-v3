import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobForm } from "@/components/admin/job-form";
import { parseJobInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;

  const job = await db.job.findUnique({ where: { id } });

  if (!job) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/jobs" label="Back to Jobs" />
      <AdminFormHeader
        title={`Edit: ${job.title}`}
        description="Update this job listing."
      />
      <JobForm
        mode="edit"
        initial={parseJobInitial(job as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
