import Link from "next/link";
import {
  FileText, Landmark, Car, GraduationCap, Cog, Stethoscope, HeartPulse, BookOpen,
  School, Building2, University, Award, Newspaper, Users, Globe, Briefcase, Atom,
  Laptop, Compass, Lightbulb, type LucideIcon,
} from "lucide-react";
import { FEATURED_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  FileText, Landmark, Car, GraduationCap, Cog, Stethoscope, HeartPulse, BookOpen,
  School, Building2, University, Award, Newspaper, Users, Globe, Briefcase, Atom,
  Laptop, Compass, Lightbulb,
};

const COLOR_CLASSES: Record<string, string> = {
  red: "bg-red-50 text-red-600 hover:bg-red-100 group-hover:scale-110",
  blue: "bg-blue-50 text-blue-600 hover:bg-blue-100 group-hover:scale-110",
  amber: "bg-amber-50 text-amber-600 hover:bg-amber-100 group-hover:scale-110",
  purple: "bg-purple-50 text-purple-600 hover:bg-purple-100 group-hover:scale-110",
  green: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 group-hover:scale-110",
  rose: "bg-rose-50 text-rose-600 hover:bg-rose-100 group-hover:scale-110",
  pink: "bg-pink-50 text-pink-600 hover:bg-pink-100 group-hover:scale-110",
  cyan: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 group-hover:scale-110",
  indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 group-hover:scale-110",
  teal: "bg-teal-50 text-teal-600 hover:bg-teal-100 group-hover:scale-110",
  emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 group-hover:scale-110",
  orange: "bg-orange-50 text-orange-600 hover:bg-orange-100 group-hover:scale-110",
};

export function CategoryGrid() {
  return (
    <section className="py-16">
      <div className="container-app">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Explore by Category</h2>
          <p className="mt-2 text-muted-foreground">Find exactly what you need — exams, colleges, scholarships, and more.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? FileText;
            const colorClass = COLOR_CLASSES[cat.color] ?? COLOR_CLASSES.red;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-border bg-card text-center hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-transform", colorClass)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
