import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { TrendingForm, parseTrendingInitial } from "@/components/admin/trending-form";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTrendingPage({ params }: PageProps) {
  const { id } = await params;
  const item = await db.trendingSearch.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/trending" label="Back to Trending Searches" />
      <AdminFormHeader
        title={`Edit: ${item.query}`}
        description="Update this trending search."
      />
      <TrendingForm
        mode="edit"
        initial={parseTrendingInitial(item as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
