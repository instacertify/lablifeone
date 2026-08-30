import { LeadForm } from "@/components/site/LeadForm";
import { getPublishedCategories } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(null, {
  title: "Privacy | Metrra Lab",
  description: "How Metrra holds the briefs you leave on the site.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const categories = await getPublishedCategories();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="display text-5xl">Privacy of the house</h1>
      <div className="prose prose-lg mt-8 max-w-none">
        <p>
          Briefs sent through Metrra Lab pages are stored in The Conservatory Chamber for the
          laboratory to answer. We use the details you give — name, email,
          company, and message — only to reply about testing work.
        </p>
        <p>
          Correspondence: contact@metrra.com. Facility address is held in The Conservatory
          and is not the brand identity.
        </p>
      </div>
      <div className="mt-12 rounded-3xl bg-mist p-6">
        <h2 className="display text-3xl">A question about your data</h2>
        <div className="mt-4">
          <LeadForm sourcePage="/privacy" categories={categories.map((c) => c.name)} />
        </div>
      </div>
    </div>
  );
}
