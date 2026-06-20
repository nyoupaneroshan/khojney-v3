import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { GovernmentServiceForm } from "@/components/admin/government-service-form";
import { parseGovernmentServiceInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGovernmentServicePage({ params }: PageProps) {
  const { id } = await params;

  const service = await db.governmentService.findUnique({ where: { id } });

  if (!service) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/government" label="Back to Government Services" />
      <AdminFormHeader
        title={`Edit: ${service.title}`}
        description="Update this government service listing."
      />
      <GovernmentServiceForm
        mode="edit"
        initial={parseGovernmentServiceInitial(
          service as unknown as Record<string, unknown>,
        )}
      />
    </div>
  );
}
