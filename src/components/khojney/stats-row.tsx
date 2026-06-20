import { GraduationCap, School, University, Award, FileText, Newspaper, Landmark, Briefcase, Building } from "lucide-react";

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
}

const STAT_CARDS: { key: keyof Stats; label: string; icon: React.ElementType; color: string }[] = [
  { key: "exams", label: "Mock Exams", icon: FileText, color: "bg-red-50 text-red-600" },
  { key: "colleges", label: "Colleges", icon: GraduationCap, color: "bg-blue-50 text-blue-600" },
  { key: "schools", label: "Schools", icon: School, color: "bg-amber-50 text-amber-600" },
  { key: "universities", label: "Universities", icon: University, color: "bg-purple-50 text-purple-600" },
  { key: "scholarships", label: "Scholarships", icon: Award, color: "bg-emerald-50 text-emerald-600" },
  { key: "banks", label: "Banks", icon: Landmark, color: "bg-cyan-50 text-cyan-600" },
  { key: "jobs", label: "Jobs", icon: Briefcase, color: "bg-orange-50 text-orange-600" },
  { key: "govtServices", label: "Govt Services", icon: Building, color: "bg-teal-50 text-teal-600" },
  { key: "posts", label: "Articles", icon: Newspaper, color: "bg-rose-50 text-rose-600" },
];

export function StatsRow({ stats }: { stats: Stats }) {
  return (
    <section className="border-b border-border bg-white">
      <div className="container-app py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
          {STAT_CARDS.map((s) => {
            const Icon = s.icon;
            const value = stats[s.key] ?? 0;
            return (
              <div key={s.key} className="flex flex-col items-center justify-center text-center p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow">
                <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold tabular-nums">{value.toLocaleString()}+</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
