import Link from "next/link";
import { Landmark, Briefcase, Building, MapPin, ArrowRight, Clock, Banknote, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Featured Banks ─────────────────────────────────────────
interface FeaturedBank {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  type: string;
  headquarters: string | null;
  establishedYear: number | null;
  savingsRateMin: number | null;
  savingsRateMax: number | null;
  fixedDepositRateMin: number | null;
  fixedDepositRateMax: number | null;
  branchCount: number | null;
  mobileBanking: boolean;
  internetBanking: boolean;
  rating: number;
  isFeatured: boolean;
}

export function FeaturedBanks({ banks }: { banks: FeaturedBank[] }) {
  if (!banks.length) return null;
  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Banks of Nepal</h2>
            <p className="mt-2 text-muted-foreground">Compare interest rates, branches, and services of major Nepali banks.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/banks">All banks <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {banks.map((b) => (
            <Card key={b.id} className="card-hover flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 font-bold">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-xs">{b.shortName}</Badge>
                </div>
                <CardTitle className="text-base leading-snug mt-2">
                  <Link href={`/banks/${b.slug}`} className="hover:text-primary line-clamp-2">{b.name}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {b.headquarters ?? "Nepal"}
                  {b.establishedYear && <span>· Est. {b.establishedYear}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-xs">Savings: {b.savingsRateMin ?? "—"}–{b.savingsRateMax ?? "—"}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs">FD: {b.fixedDepositRateMin ?? "—"}–{b.fixedDepositRateMax ?? "—"}%</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {b.mobileBanking && <Badge variant="secondary" className="text-[10px]">Mobile</Badge>}
                  {b.internetBanking && <Badge variant="secondary" className="text-[10px]">Internet</Badge>}
                  {b.branchCount && <Badge variant="outline" className="text-[10px]">{b.branchCount} branches</Badge>}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild size="sm" variant="ghost" className="ml-auto">
                  <Link href={`/banks/${b.slug}`}>View details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/banks">All banks <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Jobs ──────────────────────────────────────────
interface FeaturedJob {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string | null;
  jobType: string;
  category: string | null;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  deadline: Date | null;
}

function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return "Competitive";
  const fmt = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return String(n);
  };
  if (min && max) return `${currency} ${fmt(min)}–${fmt(max)}`;
  if (min) return `${currency} ${fmt(min)}+`;
  if (max) return `Up to ${currency} ${fmt(max)}`;
  return "Competitive";
}

function daysLeft(date: Date | null) {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function FeaturedJobs({ jobs }: { jobs: FeaturedJob[] }) {
  if (!jobs.length) return null;
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Jobs in Nepal</h2>
            <p className="mt-2 text-muted-foreground">Latest job opportunities across Nepal — apply now.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/jobs">All jobs <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((j) => {
            const days = daysLeft(j.deadline);
            return (
              <Card key={j.id} className="card-hover flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-snug">
                        <Link href={`/jobs/${j.slug}`} className="hover:text-primary line-clamp-2">{j.title}</Link>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{j.company}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-3 space-y-1.5 text-xs">
                  {j.location && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {j.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {j.jobType.replace("_", " ")} · {j.experienceLevel}
                  </div>
                  <div className="text-sm font-medium text-emerald-700 pt-1">
                    {formatSalary(j.salaryMin, j.salaryMax, j.salaryCurrency)}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {j.category && <Badge variant="outline" className="text-[10px]">{j.category}</Badge>}
                    {days !== null && days <= 7 && (
                      <Badge variant="destructive" className="text-[10px]">{days}d left</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/jobs/${j.slug}`}>View & Apply</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/jobs">All jobs <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Government Services ───────────────────────────
interface FeaturedGovtService {
  id: string;
  slug: string;
  title: string;
  category: string;
  ministry: string | null;
  department: string | null;
  processingTime: string | null;
  applicationFee: string | null;
  views: number;
}

export function FeaturedGovtServices({ services }: { services: FeaturedGovtService[] }) {
  if (!services.length) return null;
  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Government Services</h2>
            <p className="mt-2 text-muted-foreground">Step-by-step guides for Nepali government services and documents.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/government">All services <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card key={s.id} className="card-hover flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <Badge variant="outline" className="text-[10px] mb-1">{s.category}</Badge>
                    <CardTitle className="text-base leading-snug">
                      <Link href={`/government/${s.slug}`} className="hover:text-primary line-clamp-2">{s.title}</Link>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-3 space-y-1.5 text-xs text-muted-foreground">
                {s.ministry && <div className="line-clamp-1">{s.ministry}</div>}
                {s.processingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {s.processingTime}
                  </div>
                )}
                {s.applicationFee && (
                  <div className="flex items-center gap-1.5">
                    <Banknote className="h-3 w-3" /> {s.applicationFee}
                  </div>
                )}
                <div className="pt-1">{s.views.toLocaleString()} views</div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild size="sm" variant="ghost" className="ml-auto">
                  <Link href={`/government/${s.slug}`}>View Process</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/government">All services <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
