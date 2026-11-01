import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { NepseStockForm } from "@/components/admin/nepse-stock-form";
import { parseNepseStockInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNepseStockPage({ params }: PageProps) {
  const { id } = await params;

  const stock = await db.nepseStock.findUnique({ where: { id } });

  if (!stock) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/nepse" label="Back to NEPSE" />
      <AdminFormHeader
        title={`Edit: ${stock.symbol} (${stock.companyName})`}
        description="Update market statistics, financial ratios, dividends, and corporate details."
      />
      <NepseStockForm
        mode="edit"
        initial={parseNepseStockInitial(stock as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
