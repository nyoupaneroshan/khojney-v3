import Link from "next/link";
import { TrendingUp, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingItem {
  id: string;
  query: string;
  count: number;
  module?: string | null;
}

export function TrendingSearches({ trending }: { trending: TrendingItem[] }) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-app">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            Trending Searches
          </h2>
          <p className="mt-2 text-muted-foreground">What Nepal is searching for right now.</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Trending</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {trending.map((t, i) => (
                <li key={t.id}>
                  <Link
                    href={`/search?q=${encodeURIComponent(t.query)}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-accent/50 px-2 -mx-2 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <span className="font-medium truncate">{t.query}</span>
                      {t.module && (
                        <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                          {t.module}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {t.count.toLocaleString()} searches
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Search className="h-4 w-4" />
            Browse all resources
          </Link>
        </div>
      </div>
    </section>
  );
}
