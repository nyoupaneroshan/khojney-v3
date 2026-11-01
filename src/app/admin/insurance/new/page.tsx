import { InsuranceCompanyForm } from "@/components/admin/insurance-company-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewInsurancePage() {
  return (
    <div>
      <BackToAdminLink href="/admin/insurance" label="Back to Insurance" />
      <AdminFormHeader
        title="Add Insurance Company"
        description="Register a new insurance provider with claim ratios, solvency, and coverage plans."
      />
      <InsuranceCompanyForm mode="create" />
    </div>
  );
}
