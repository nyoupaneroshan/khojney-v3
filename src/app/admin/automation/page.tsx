import { db } from "@/lib/db";
import { AdminFormHeader, BackToAdminLink } from "@/components/admin/admin-list";
import { AutomationPanel } from "@/components/admin/automation-panel";

export const dynamic = "force-dynamic";

/**
 * Admin automation page.
 *
 * The Prisma query returns `Date` objects for `lastTriggered`, `createdAt`,
 * etc., but the client `AutomationPanel` component expects ISO strings (so
 * they survive RSC serialization cleanly). We serialize here at the server
 * boundary.
 */
export default async function AutomationPage() {
  const webhooks = await db.webhook.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { logs: true } },
      logs: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          event: true,
          success: true,
          statusCode: true,
          createdAt: true,
          response: true,
        },
      },
    },
  });

  const serialized = webhooks.map((w) => ({
    ...w,
    lastTriggered:
      w.lastTriggered instanceof Date ? w.lastTriggered.toISOString() : null,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    logs: w.logs.map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
    })),
  }));

  return (
    <div>
      <BackToAdminLink href="/admin" label="Back" />
      <AdminFormHeader
        title="Automation & Webhooks"
        description="Connect to n8n, Zapier, or any HTTP endpoint."
      />
      <AutomationPanel webhooks={serialized} />
    </div>
  );
}
