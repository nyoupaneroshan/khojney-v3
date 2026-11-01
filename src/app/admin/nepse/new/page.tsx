import { NepseStockForm } from "@/components/admin/nepse-stock-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewNepseStockPage() {
  return (
    <div>
      <BackToAdminLink href="/admin/nepse" label="Back to NEPSE" />
      <AdminFormHeader
        title="Add Listed Company"
        description="Add a new listed company on NEPSE with trading prices and valuation metrics."
      />
      <NepseStockForm mode="create" />
    </div>
  );
}
