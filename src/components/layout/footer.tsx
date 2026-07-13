import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container-app py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                K
              </div>
              <span className="text-xl font-bold">Khojney<span className="text-primary">.com</span></span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Everything about Nepal, in one place. Prepare for exams, discover colleges, find scholarships, banks, jobs, and government services.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Youtube" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm">Education</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/exams" className="text-muted-foreground hover:text-primary">Mock Exams</Link></li>
              <li><Link href="/colleges" className="text-muted-foreground hover:text-primary">Colleges</Link></li>
              <li><Link href="/schools" className="text-muted-foreground hover:text-primary">Schools</Link></li>
              <li><Link href="/universities" className="text-muted-foreground hover:text-primary">Universities</Link></li>
              <li><Link href="/scholarships" className="text-muted-foreground hover:text-primary">Scholarships</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm">Finance & Govt</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/banks" className="text-muted-foreground hover:text-primary">Banks of Nepal</Link></li>
              <li><Link href="/government" className="text-muted-foreground hover:text-primary">Government Services</Link></li>
              <li><Link href="/government?category=CITIZENSHIP" className="text-muted-foreground hover:text-primary">Citizenship</Link></li>
              <li><Link href="/government?category=PASSPORT" className="text-muted-foreground hover:text-primary">Passport</Link></li>
              <li><Link href="/government?category=LICENSE" className="text-muted-foreground hover:text-primary">Driving License</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm">Careers & More</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/jobs" className="text-muted-foreground hover:text-primary">Jobs in Nepal</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/compare" className="text-muted-foreground hover:text-primary">Compare Colleges</Link></li>
              <li><Link href="/in" className="text-muted-foreground hover:text-primary">Browse by Location</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-primary">Search</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm">Company</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/sitemap.xml" className="text-muted-foreground hover:text-primary">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Khojney.com · Built with ❤️ in Kathmandu, Nepal.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
