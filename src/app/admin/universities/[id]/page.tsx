import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { UniversityForm } from "@/components/admin/university-form";
import { parseUniversityInitial } from "@/lib/admin-parsers";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUniversityPage({ params }: PageProps) {
  const { id } = await params;
  const university = await db.university.findUnique({ where: { id } });
  if (!university) notFound();

  return (
    <div>
      <BackToAdminLink href="/admin/universities" label="Back to Universities" />
      <AdminFormHeader
        title={`Edit: ${university.name}`}
        description="Update this university listing."
      />
      <UniversityForm
        mode="edit"
        initial={parseUniversityInitial(university as unknown as Record<string, unknown>)}
      />
    </div>
  );
}
