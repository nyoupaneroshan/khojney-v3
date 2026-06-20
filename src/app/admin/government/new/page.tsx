import { GovernmentServiceForm } from "@/components/admin/government-service-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewGovernmentServicePage() {
  return (
    <div>
      <BackToAdminLink href="/admin/government" label="Back to Government Services" />
      <AdminFormHeader
        title="Add New Government Service"
        description="Create a new government service listing. Slug is auto-generated from the title."
      />
      <GovernmentServiceForm mode="create" />
    </div>
  );
}
