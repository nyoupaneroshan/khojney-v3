import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BankForm } from "@/components/admin/bank-form";
import { parseBankInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBankPage({ params }: PageProps) {
  const { id } = await params;

  const bank = await db.bank.findUnique({ where: { id } });

  if (!bank) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/banks" label="Back to Banks" />
      <AdminFormHeader
        title={`Edit: ${bank.name}`}
        description="Update this bank listing."
      />
      <BankForm
        mode="edit"
        initial={parseBankInitial(bank as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
