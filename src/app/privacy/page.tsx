import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Khojney collects, uses, and protects your personal information.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const user = await getSession();
  return (
    <AppShell user={user}>
      <div className="container-app py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="prose-content mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
              <p>Khojney (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website khojney.com (the &quot;Service&quot;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
              <p>We collect: account information (name, email, hashed password), profile information (phone, location, bio), usage data (IP, browser, pages visited), exam attempts (answers, scores, rankings), bookmarks and notifications.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <p>We use your information to provide and improve our Service, personalize your experience, display rankings, send notifications about exams/scholarships/deadlines, respond to your requests, and analyze trends.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">4. Sharing Your Information</h2>
              <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except to comply with legal obligations, protect our rights, or with service providers who help us operate the Service.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
              <p>We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information, opt out of marketing communications, and object to our processing of your information. Contact us at <a href="mailto:privacy@khojney.com" className="text-primary">privacy@khojney.com</a>.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">7. Cookies</h2>
              <p>We use cookies to maintain your session, remember preferences, and analyze usage. You can disable cookies in your browser, but some features may not function properly.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">9. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:privacy@khojney.com" className="text-primary">privacy@khojney.com</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
