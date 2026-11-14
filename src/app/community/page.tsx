import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CommunityHub } from "@/components/khojney/community-hub";

export const metadata: Metadata = {
  title: "Community Q&A & Discussion Forum | Khojney Nepal",
  description:
    "Ask questions, share advice, and connect with fellow students, teachers, and professionals across Nepal on colleges, exams, and career pathways.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Community Q&A & Discussion Forum | Khojney Nepal",
    description:
      "Ask questions, share advice, and connect with fellow students, teachers, and professionals across Nepal on colleges, exams, and career pathways.",
    url: "/community",
  },
};

export const revalidate = 300;

export default function CommunityPage() {
  return (
    <AppShell>
      <CommunityHub />
    </AppShell>
  );
}
