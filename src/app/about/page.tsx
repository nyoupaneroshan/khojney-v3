import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Target, Sparkles, Globe, BookOpen, Users, Award } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "About Khojney",
  description: "Khojney is on a mission to organize every exam, college, scholarship, and resource in Nepal into one accessible platform.",
};

export const dynamic = "force-dynamic";

const VALUES = [
  { icon: Target, title: "Our Mission", description: "Organize every educational and informational resource in Nepal — every exam, every college, every scholarship — into one accessible, free, and trustworthy platform." },
  { icon: Sparkles, title: "Our Vision", description: "To become Nepal's Wikipedia + LinkedIn + Coursera — the largest knowledge ecosystem serving millions of students, educators, and professionals across the country." },
  { icon: Globe, title: "Accessibility", description: "Mobile-first design that works on any device, even on slow 3G connections. Free forever for students. Available in English and Devanagari Nepali." },
  { icon: BookOpen, title: "Comprehensive", description: "From SEE mock tests to Loksewa prep, from medical college directories to international scholarships — Khojney covers every stage of a Nepali student's journey." },
  { icon: Users, title: "Community-Driven", description: "Reviews, ratings, and contributions from real students, parents, and educators. Verified badges for institutions that meet our quality standards." },
  { icon: Award, title: "Quality First", description: "Every piece of content is reviewed by our editorial team. Exam patterns match official sources. College data is verified with affiliating universities." },
];

export default async function AboutPage() {
  const user = await getSession();
  const stats = {
    colleges: await db.college.count(),
    schools: await db.school.count(),
    universities: await db.university.count(),
    exams: await db.exam.count({ where: { isPublished: true } }),
    scholarships: await db.scholarship.count(),
    posts: await db.blogPost.count({ where: { status: "PUBLISHED" } }),
    banks: await db.bank.count(),
    jobs: await db.job.count({ where: { isPublished: true } }),
    govtServices: await db.governmentService.count({ where: { isPublished: true } }),
  };

  return (
    <AppShell user={user}>
      <section className="border-b border-border bg-gradient-to-br from-red-50/40 via-white to-blue-50/30">
        <div className="container-app py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Building Nepal's knowledge ecosystem</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About <span className="text-gradient-red">Khojney</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Khojney (खोज्ने — "to search" in Nepali) is on a mission to organize every exam,
            college, scholarship, bank, job, and government service in Nepal into one accessible,
            free, and trustworthy platform. We believe every Nepali student deserves equal access
            to information, regardless of geography or income.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Our Reach</h2>
            <p className="mt-2 text-muted-foreground">Real numbers from the Khojney platform.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Mock Exams", value: stats.exams },
              { label: "Colleges", value: stats.colleges },
              { label: "Schools", value: stats.schools },
              { label: "Universities", value: stats.universities },
              { label: "Scholarships", value: stats.scholarships },
              { label: "Banks", value: stats.banks },
              { label: "Jobs", value: stats.jobs },
              { label: "Govt Services", value: stats.govtServices },
              { label: "Articles", value: stats.posts },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="text-3xl font-bold text-primary tabular-nums">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Khojney Story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Khojney was founded with a simple observation: students in Nepal spend more time
              searching for information than actually studying. Whether it's finding the IOE
              entrance syllabus, comparing colleges, tracking scholarship deadlines, or figuring
              out how to apply for a passport — the information is scattered across dozens of
              outdated websites and PDFs.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We're building Khojney to change that. One platform, every resource, free forever.
              Our team of educators, engineers, and content creators work tirelessly to verify
              every piece of information and keep it up to date.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/login?mode=register" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Join Khojney
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
