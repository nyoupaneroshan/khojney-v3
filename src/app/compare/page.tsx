import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";
import { CompareTool } from "@/components/khojney/compare-tool";

export const metadata: Metadata = {
  title: "Compare Colleges & Schools",
  description: "Compare colleges and schools in Nepal side by side — fees, programs, ratings, facilities, and more.",
};

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const user = await getSession();
  const [colleges, schools] = await Promise.all([
    db.college.findMany({
      where: { isPublished: true },
      select: {
        id: true, slug: true, name: true, city: true, district: true,
        province: true, affiliation: true, type: true, establishedYear: true,
        feesRange: true, rating: true, reviewCount: true, isVerified: true,
        programs: true, facilities: true, scholarshipsAvailable: true,
      },
      orderBy: { name: "asc" },
    }),
    db.school.findMany({
      where: { isPublished: true },
      select: {
        id: true, slug: true, name: true, city: true, district: true,
        province: true, affiliation: true, type: true, establishedYear: true,
        feesRange: true, rating: true, reviewCount: true, isVerified: true,
        programs: true, facilities: true, level: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AppShell user={user}>
      <section className="border-b border-border bg-gradient-to-br from-red-50/40 via-white to-blue-50/30">
        <div className="container-app py-12 md:py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Compare <span className="text-gradient-red">Colleges & Schools</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select up to 3 institutions to compare side by side — fees, programs, ratings, facilities, and more.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-app">
          <CompareTool colleges={colleges} schools={schools} />
        </div>
      </section>
    </AppShell>
  );
}
