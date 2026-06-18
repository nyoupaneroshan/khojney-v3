import { UniversityForm } from "@/components/admin/university-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewUniversityPage() {
  return (
    <div>
      <BackToAdminLink href="/admin/universities" label="Back to Universities" />
      <AdminFormHeader
        title="Add New University"
        description="Create a new university listing."
      />
      <UniversityForm mode="create" />
    </div>
  );
}
