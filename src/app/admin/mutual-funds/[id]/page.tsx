import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MutualFundForm } from "@/components/admin/mutual-fund-form";
import { parseMutualFundInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMutualFundPage({ params }: PageProps) {
  const { id } = await params;

  const fund = await db.mutualFund.findUnique({ where: { id } });

  if (!fund) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/mutual-funds" label="Back to Mutual Funds" />
      <AdminFormHeader
        title={`Edit: ${fund.name}`}
        description="Update scheme information, NAV metrics, and portfolio holdings."
      />
      <MutualFundForm
        mode="edit"
        initial={parseMutualFundInitial(fund as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
