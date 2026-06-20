import Link from "next/link";
import { Home, Search, BookOpen, FileQuestion } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />
      <main className="flex-1 flex items-center justify-center">
        <div className="container-app py-16 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileQuestion className="h-10 w-10" />
            </div>
            <h1 className="text-7xl font-bold tracking-tight text-primary">404</h1>
            <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
            <p className="mt-3 text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved, deleted, or never existed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
              <Link href="/search" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-accent">
                <Search className="h-4 w-4" /> Search Khojney
              </Link>
              <Link href="/blog" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-accent">
                <BookOpen className="h-4 w-4" /> Browse Blog
              </Link>
            </div>
            <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-left">
              <p className="text-sm font-medium mb-2">Popular destinations:</p>
              <ul className="grid grid-cols-2 gap-1 text-sm">
                <li><Link href="/exams" className="text-muted-foreground hover:text-primary">Mock Exams</Link></li>
                <li><Link href="/colleges" className="text-muted-foreground hover:text-primary">Colleges</Link></li>
                <li><Link href="/schools" className="text-muted-foreground hover:text-primary">Schools</Link></li>
                <li><Link href="/universities" className="text-muted-foreground hover:text-primary">Universities</Link></li>
                <li><Link href="/scholarships" className="text-muted-foreground hover:text-primary">Scholarships</Link></li>
                <li><Link href="/banks" className="text-muted-foreground hover:text-primary">Banks</Link></li>
                <li><Link href="/jobs" className="text-muted-foreground hover:text-primary">Jobs</Link></li>
                <li><Link href="/government" className="text-muted-foreground hover:text-primary">Govt Services</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
