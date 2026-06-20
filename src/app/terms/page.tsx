import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using Khojney's services.",
};

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const user = await getSession();
  return (
    <AppShell user={user}>
      <div className="container-app py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="prose-content mt-8 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>By accessing or using Khojney.com (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, please do not use the Service.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
              <p>Khojney provides a free platform for Nepali students and lifelong learners to access mock exams, college directories, scholarship listings, bank comparisons, job postings, government service guides, and educational articles.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 13 years old to create an account.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">4. User Conduct</h2>
              <p>You agree not to: use the Service for unlawful purposes; post defamatory or infringing content; attempt unauthorized access; use automated systems without consent; submit false information in reviews; or interfere with the Service.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">5. User-Generated Content</h2>
              <p>You retain ownership of content you submit. By submitting, you grant Khojney a worldwide, non-exclusive, royalty-free license to use that content in connection with the Service. We may remove content that violates these Terms.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">6. Intellectual Property</h2>
              <p>The Service and its original content are owned by Khojney and protected by international copyright, trademark, and other laws. Third-party names and logos belong to their respective owners.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">7. Disclaimers</h2>
              <p>The information on Khojney is for general informational purposes only. While we strive for accuracy, we make no warranties. Exam patterns, syllabi, and deadlines may change — always verify with official sources.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
              <p>In no event shall Khojney be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the Service.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">9. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. Your continued use after changes constitutes acceptance of the new Terms.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-foreground">10. Contact</h2>
              <p>Questions about these Terms? Contact <a href="mailto:legal@khojney.com" className="text-primary">legal@khojney.com</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
