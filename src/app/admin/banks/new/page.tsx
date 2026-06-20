import { BankForm } from "@/components/admin/bank-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewBankPage() {
  // Bank module currently does not use categories, but we fetch them here for
  // symmetry with other modules and to keep the door open for future categorisation.
  return (
    <div>
      <BackToAdminLink href="/admin/banks" label="Back to Banks" />
      <AdminFormHeader
        title="Add New Bank"
        description="Create a new bank listing. Slug is auto-generated from name."
      />
      <BankForm mode="create" />
    </div>
  );
}
