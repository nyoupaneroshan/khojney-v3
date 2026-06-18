import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface AppShellProps {
  children: React.ReactNode;
  user?: { id: string; name: string | null; email: string; role: string } | null;
}

/**
 * Wraps every public-facing page with the standard header + footer.
 */
export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
