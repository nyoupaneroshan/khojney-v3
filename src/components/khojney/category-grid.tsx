import Link from "next/link";
import {
  FileText, Landmark, Car, GraduationCap, Cog, Stethoscope, HeartPulse, BookOpen,
  School, Building2, University, Award, Newspaper, Users, Globe, Briefcase, Atom,
  Laptop, Compass, Lightbulb, TrendingUp, LineChart, ShieldCheck, ArrowRight, type LucideIcon,
} from "lucide-react";
import { FEATURED_CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  FileText, Landmark, Car, GraduationCap, Cog, Stethoscope, HeartPulse, BookOpen,
  School, Building2, University, Award, Newspaper, Users, Globe, Briefcase, Atom,
  Laptop, Compass, Lightbulb, TrendingUp, LineChart, ShieldCheck,
};

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 border-b border-border bg-background">
      <div className="container-app">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              <Compass className="h-3.5 w-3.5" /> Structured Directory
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Explore by Category
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
              Instant access to exams, accredited colleges, verified scholarships, career vacancies, and civic guides.
            </p>
          </div>

          <Link
            href="/colleges"
            className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline self-start sm:self-auto"
          >
            All directories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? FileText;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative flex flex-col items-start justify-between p-4 sm:p-5 rounded-2xl border border-border bg-card text-left hover:border-primary/50 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="mt-4 w-full">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors block">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center justify-between mt-1">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
