import { MutualFundForm } from "@/components/admin/mutual-fund-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewMutualFundPage() {
  return (
    <div>
      <BackToAdminLink href="/admin/mutual-funds" label="Back to Mutual Funds" />
      <AdminFormHeader
        title="Add New Mutual Fund"
        description="Register a new mutual fund scheme with NAV, manager, and top holdings."
      />
      <MutualFundForm mode="create" />
    </div>
  );
}
