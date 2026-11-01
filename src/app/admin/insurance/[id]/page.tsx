import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InsuranceCompanyForm } from "@/components/admin/insurance-company-form";
import { parseInsuranceCompanyInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInsurancePage({ params }: PageProps) {
  const { id } = await params;

  const company = await db.insuranceCompany.findUnique({ where: { id } });

  if (!company) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/insurance" label="Back to Insurance" />
      <AdminFormHeader
        title={`Edit: ${company.name}`}
        description="Update solvency, claim settlement performance, branch coverage, and plans."
      />
      <InsuranceCompanyForm
        mode="edit"
        initial={parseInsuranceCompanyInitial(company as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
