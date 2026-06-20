import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { ContactForm } from "@/components/khojney/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Khojney team. We'd love to hear from you.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const user = await getSession();
  const channels = [
    { icon: Mail, label: "Email", value: "hello@khojney.com", href: "mailto:hello@khojney.com" },
    { icon: Phone, label: "Phone", value: "+977-1-4000000", href: "tel:+97714000000" },
    { icon: MapPin, label: "Office", value: "Kathmandu, Nepal", href: null },
    { icon: Clock, label: "Hours", value: "Sun-Fri, 9 AM - 6 PM NPT", href: null },
  ];

  return (
    <AppShell user={user}>
      <section className="border-b border-border bg-gradient-to-br from-red-50/40 via-white to-blue-50/30">
        <div className="container-app py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Get in <span className="text-gradient-red">touch</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, suggestion, or partnership idea? We&apos;d love to hear from you.
            Fill out the form below or reach out through any of our channels.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Contact Channels</h2>
                <ul className="space-y-4">
                  {channels.map((c) => {
                    const Icon = c.icon;
                    return (
                      <li key={c.label} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{c.label}</div>
                          {c.href ? (
                            <a href={c.href} className="font-medium hover:text-primary">{c.value}</a>
                          ) : (
                            <div className="font-medium">{c.value}</div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h3 className="font-semibold">For Institutions</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Are you a college, school, university, bank, or scholarship provider? Claim your
                  profile or partner with us by emailing
                  <a href="mailto:partners@khojney.com" className="text-primary"> partners@khojney.com</a>.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h3 className="font-semibold">Report an Issue</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Found incorrect information or a bug? Email
                  <a href="mailto:bugs@khojney.com" className="text-primary"> bugs@khojney.com</a>
                  {" "}and we&apos;ll fix it within 48 hours.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" /> Send us a message
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We typically respond within 1-2 business days.
                </p>
                <ContactForm defaultEmail={user?.email} defaultName={user?.name} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
