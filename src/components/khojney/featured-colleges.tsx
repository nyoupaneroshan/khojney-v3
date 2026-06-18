import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BadgeCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturedCollege {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string | null;
  district: string | null;
  province: string | null;
  affiliation: string | null;
  type: string;
  rating: number;
  isVerified: boolean;
  feesRange: string | null;
  logo: string | null;
}

export function FeaturedColleges({ colleges }: { colleges: FeaturedCollege[] }) {
  if (!colleges.length) return null;

  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Colleges</h2>
            <p className="mt-2 text-muted-foreground">Top-rated colleges across Nepal.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/colleges">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {colleges.map((c) => (
            <Card key={c.id} className="card-hover flex flex-col overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  {c.isVerified && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                <Link href={`/colleges/${c.slug}`} className="font-semibold leading-snug hover:text-primary line-clamp-2 mt-2">
                  {c.name}
                </Link>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {c.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {c.city}
                    </span>
                  )}
                  {c.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.affiliation && <Badge variant="outline" className="text-xs">{c.affiliation}</Badge>}
                  <Badge variant="outline" className="text-xs">{c.type}</Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild size="sm" variant="ghost" className="ml-auto">
                  <Link href={`/colleges/${c.slug}`}>View details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/colleges">View all colleges <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
