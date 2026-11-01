import { HospitalForm } from "@/components/admin/hospital-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewHospitalPage() {
  return (
    <div>
      <BackToAdminLink href="/admin/hospitals" label="Back to Hospitals" />
      <AdminFormHeader
        title="Add New Hospital"
        description="Create a new hospital listing with specialties, emergency facilities, and bed counts."
      />
      <HospitalForm mode="create" />
    </div>
  );
}
