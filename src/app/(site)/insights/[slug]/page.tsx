import Image from "next/image";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/LeadForm";
import { getInsightBySlug, getPublishedCategories, getSeoByPath } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  const seo = await getSeoByPath(`/insights/${slug}`);
  return buildMetadata(seo, {
    title: `${insight?.title || "Insight"} | Metrra Lab`,
    description: insight?.excerpt || "A note from the Metrra folio.",
    path: `/insights/${slug}`,
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [insight, categories] = await Promise.all([
    getInsightBySlug(slug),
    getPublishedCategories(),
  ]);
  if (!insight || !insight.published) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-ink py-24 text-ivory">
        {insight.image && (
          <Image src={insight.image} alt="" fill className="object-cover opacity-30" />
        )}
        <div className="relative mx-auto max-w-4xl px-5">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Insight</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">{insight.title}</h1>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div
          className="folio-content prose prose-lg max-w-none prose-headings:font-serif"
          dangerouslySetInnerHTML={{ __html: insight.content }}
        />
        <div className="mt-16 rounded-3xl bg-mist p-8">
          <h2 className="display text-3xl">Respond to this note</h2>
          <div className="mt-5">
            <LeadForm sourcePage={`/insights/${slug}`} categories={categories.map((c) => c.name)} />
          </div>
        </div>
      </div>
    </article>
  );
}
