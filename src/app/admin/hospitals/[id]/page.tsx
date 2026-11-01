import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { HospitalForm } from "@/components/admin/hospital-form";
import { parseHospitalInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHospitalPage({ params }: PageProps) {
  const { id } = await params;

  const hospital = await db.hospital.findUnique({ where: { id } });

  if (!hospital) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/hospitals" label="Back to Hospitals" />
      <AdminFormHeader
        title={`Edit: ${hospital.name}`}
        description="Update hospital details, emergency contacts, bed capacity, and specialties."
      />
      <HospitalForm
        mode="edit"
        initial={parseHospitalInitial(hospital as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
