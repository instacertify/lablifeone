import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleIdentity } from "@/components/site/ArticleIdentity";
import { LeadForm } from "@/components/site/LeadForm";
import {
  flattenCategoryNames,
  getInsightBySlug,
  getPublishedCategories,
  getSeoByPath,
  getSettings,
} from "@/lib/data";
import { safeMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const insight = await getInsightBySlug(slug);
    return safeMetadata(() => getSeoByPath(`/insights/${slug}`), {
      title: `${insight?.title || "Industry Insights"} | Metrra Lab`,
      description: insight?.excerpt || "A note from Metrra Lab.",
      path: `/insights/${slug}`,
    });
  } catch {
    return safeMetadata(async () => null, {
      title: "Industry Insights | Metrra Lab",
      description: "A note from Metrra Lab.",
      path: `/insights/${slug}`,
    });
  }
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [insight, categories, settings] = await Promise.all([
    getInsightBySlug(slug),
    getPublishedCategories(),
    getSettings(),
  ]);
  if (!insight || !insight.published) notFound();

  const writerName = insight.writerName || settings?.companyName || "Metrra Lab";
  const writerRole = insight.writerRole || "Editorial folio";
  const identityLine =
    insight.identityLine || settings?.identityLine || "A global laboratory with global solutions";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    image: insight.image ? siteUrl(insight.image) : undefined,
    datePublished: insight.publishedAt?.toISOString(),
    dateModified: insight.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: writerName,
      jobTitle: writerRole,
    },
    publisher: {
      "@type": "Organization",
      name: settings?.companyName || "Metrra Lab",
      slogan: identityLine,
    },
  };

  return (
    <article>
      <header className="relative overflow-hidden bg-ink py-24 text-ivory">
        {insight.image && (
          <Image src={insight.image} alt="" fill className="object-cover opacity-30" />
        )}
        <div className="relative mx-auto max-w-4xl px-5">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">
            <Link href="/insights" className="hover:text-white">
              Industry Insights
            </Link>
            {insight.industry && (
              <>
                <span className="mx-2 text-white/30">/</span>
                <Link
                  href={`/insights?industry=${insight.industry.slug}`}
                  className="hover:text-white"
                >
                  {insight.industry.name}
                </Link>
              </>
            )}
          </p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-6xl">{insight.title}</h1>
          <div className="mt-6">
            <ArticleIdentity
              writerName={writerName}
              writerRole={writerRole}
              identityLine={identityLine}
              publishedAt={insight.publishedAt}
              tone="ivory"
            />
          </div>
        </div>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div
          className="folio-content prose prose-lg max-w-none prose-headings:font-serif"
          dangerouslySetInnerHTML={{ __html: insight.content }}
        />
        <div className="mt-16 rounded-3xl bg-mist p-8">
          <h2 className="display text-3xl">Respond to this note</h2>
          <div className="mt-5">
            <LeadForm
              sourcePage={`/insights/${slug}`}
              categories={flattenCategoryNames(categories)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
