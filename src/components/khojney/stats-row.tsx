import { GraduationCap, FileText, Award, Building2 } from "lucide-react";

interface Stats {
  colleges: number;
  schools: number;
  universities: number;
  exams: number;
  scholarships: number;
  posts: number;
  banks?: number;
  jobs?: number;
  govtServices?: number;
  hospitals?: number;
  mutualFunds?: number;
  nepseStocks?: number;
  insurance?: number;
}

export function StatsRow({ stats }: { stats: Stats }) {
  const totalInstitutions = (stats.colleges || 0) + (stats.schools || 0) + (stats.universities || 0);
  const totalOpportunities = (stats.scholarships || 0) + (stats.jobs || 0);
  const totalServicesAndFinance = (stats.banks || 0) + (stats.govtServices || 0) + (stats.hospitals || 0) + (stats.nepseStocks || 0);

  const PILLARS = [
    {
      label: "Mock Exams & Tests",
      sublabel: "IOE, CEE, CMAT & Loksewa with instant scoring",
      value: (stats.exams || 0).toLocaleString(),
      icon: FileText,
      badge: "Free Access",
    },
    {
      label: "Verified Institutions",
      sublabel: "Accredited colleges, +2 schools & universities",
      value: totalInstitutions.toLocaleString(),
      icon: GraduationCap,
      badge: "7 Provinces",
    },
    {
      label: "Scholarships & Jobs",
      sublabel: "Domestic, government & international programs",
      value: totalOpportunities.toLocaleString(),
      icon: Award,
      badge: "Weekly Updates",
    },
    {
      label: "Finance & Civic Services",
      sublabel: "Banks, NEPSE stocks, hospitals & citizen guides",
      value: totalServicesAndFinance.toLocaleString(),
      icon: Building2,
      badge: "Verified Data",
    },
  ];

  return (
    <section className="border-b border-border bg-muted/20 py-8">
      <div className="container-app">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-border/60">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className={`flex flex-col justify-between pt-4 sm:pt-0 ${idx > 0 ? "lg:pl-6" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-card border border-border px-2 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground tabular-nums">
                    {p.value}
                    <span className="text-primary text-2xl font-bold">+</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mt-1">{p.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{p.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
