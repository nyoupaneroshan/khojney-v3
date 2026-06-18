import { TrendingForm } from "@/components/admin/trending-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

export default async function NewTrendingPage() {
  return (
    <div>
      <BackToAdminLink href="/admin/trending" label="Back to Trending Searches" />
      <AdminFormHeader
        title="Add New Trending Search"
        description="Create a new trending search term."
      />
      <TrendingForm mode="create" />
    </div>
  );
}
