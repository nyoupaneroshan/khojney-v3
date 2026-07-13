/**
 * Cross-link footer shown at the bottom of list pages.
 *
 * Improves SEO by creating internal links between related modules and
 * helps users discover other sections of the site.
 */
import Link from "next/link";

interface CrossLink {
  label: string;
  href: string;
}

const ALL_LINKS: Record<string, CrossLink[]> = {
  colleges: [
    { label: "Mock Exams", href: "/mock-exams" },
    { label: "Universities", href: "/universities" },
    { label: "Schools", href: "/schools" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Best Engineering Colleges", href: "/blog/best-engineering-colleges-nepal-2025-top-10-rankings" },
    { label: "Best IT Colleges", href: "/blog/best-it-colleges-nepal-2025-top-10-rankings" },
    { label: "Top 10 Colleges in Nepal", href: "/blog/top-10-colleges-nepal-2025-plus2-engineering-medical" },
    { label: "College Admission Guide", href: "/blog/nepal-college-admission-guide-how-to-apply-universities-2025" },
  ],
  schools: [
    { label: "Colleges", href: "/colleges" },
    { label: "Universities", href: "/universities" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Best Schools in Nepal", href: "/blog/best-schools-nepal-2025-top-10-rankings-admissions" },
    { label: "SEE Exam Guide", href: "/blog/see-exam-nepal-grading-system-complete-guide-2025" },
    { label: "Top 10 Colleges", href: "/blog/top-10-colleges-nepal-2025-plus2-engineering-medical" },
  ],
  universities: [
    { label: "Colleges", href: "/colleges" },
    { label: "Schools", href: "/schools" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Top Universities in Nepal", href: "/blog/top-universities-nepal-2025-rankings-programs" },
    { label: "College Admission Guide", href: "/blog/nepal-college-admission-guide-how-to-apply-universities-2025" },
    { label: "Pulchowk Campus Ranking", href: "/blog/pulchowk-campus-ranking-ioe-constituent-campuses-nepal-2025" },
  ],
  scholarships: [
    { label: "Colleges", href: "/colleges" },
    { label: "Universities", href: "/universities" },
    { label: "Mock Exams", href: "/mock-exams" },
    { label: "Nepal Scholarships Guide", href: "/blog/nepal-scholarships-undergraduates-see-toppers-free-seats-2025" },
    { label: "Study Nepal from Abroad", href: "/blog/study-nepal-from-abroad-diaspora-scholarships-nepali-students" },
    { label: "College Admission Guide", href: "/blog/nepal-college-admission-guide-how-to-apply-universities-2025" },
  ],
  banks: [
    { label: "Jobs", href: "/jobs" },
    { label: "Government Services", href: "/government" },
    { label: "Banking Exam Preparation", href: "/blog/nepal-banking-exam-preparation-guide" },
    { label: "Compare Bank Interest Rates", href: "/blog/nepal-banks-compare-interest-rates" },
  ],
  jobs: [
    { label: "Banks", href: "/banks" },
    { label: "Government Services", href: "/government" },
    { label: "Mock Exams", href: "/mock-exams" },
    { label: "Loksewa Preparation Guide", href: "/blog/loksewa-preparation-tips-nepal-complete-study-guide-2025" },
    { label: "IOE vs IOM Career Comparison", href: "/blog/ioe-vs-iom-entrance-comparison-engineering-vs-medical-nepal" },
  ],
  government: [
    { label: "Jobs", href: "/jobs" },
    { label: "Banks", href: "/banks" },
    { label: "Driving License Guide", href: "/blog/dotm-exam-nepal-driving-license-complete-guide-2025" },
    { label: "Loksewa Preparation Guide", href: "/blog/loksewa-preparation-tips-nepal-complete-study-guide-2025" },
    { label: "Driving License Mock Test", href: "/exams/driving-license-parent" },
    { label: "Loksewa Mock Test", href: "/exams/loksewa-kharidar" },
  ],
  blog: [
    { label: "Mock Exams", href: "/mock-exams" },
    { label: "Colleges", href: "/colleges" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Jobs", href: "/jobs" },
  ],
  exams: [
    { label: "Colleges", href: "/colleges" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Universities", href: "/universities" },
    { label: "IOE Mock Test Guide", href: "/blog/ioe-mock-test-free-online-complete-guide" },
    { label: "CEE Mock Test Guide", href: "/blog/cee-mock-test-free-online-nepal-mbbs-entrance" },
    { label: "CMAT Mock Test Guide", href: "/blog/cmat-mock-test-nepal-free-preparation-guide" },
    { label: "Loksewa Preparation Guide", href: "/blog/loksewa-preparation-tips-nepal-complete-study-guide-2025" },
    { label: "Driving License Guide", href: "/blog/dotm-exam-nepal-driving-license-complete-guide-2025" },
  ],
};

interface CrossLinkFooterProps {
  /** Which module's link set to show. */
  module: keyof typeof ALL_LINKS;
  /** Optional heading override. Default: "Explore more on Khojney" */
  title?: string;
}

export function CrossLinkFooter({ module, title = "Explore more on Khojney" }: CrossLinkFooterProps) {
  const links = ALL_LINKS[module];
  if (!links || links.length === 0) return null;

  return (
    <section className="py-10 border-t mt-10" aria-label="Related resources">
      <div className="container-app">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          {title}
        </h2>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
