/**
 * Renders a JSON-LD structured data `<script>` tag for SEO.
 * Pass any valid schema.org object — it will be JSON-stringified.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
