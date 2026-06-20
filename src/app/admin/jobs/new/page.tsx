import { JobForm } from "@/components/admin/job-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  return (
    <div>
      <BackToAdminLink href="/admin/jobs" label="Back to Jobs" />
      <AdminFormHeader
        title="Add New Job"
        description="Create a new job listing. Slug is auto-generated from title."
      />
      <JobForm mode="create" />
    </div>
  );
}
