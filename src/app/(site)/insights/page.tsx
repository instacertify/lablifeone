import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/site/LeadForm";
import { IndustryFilter } from "@/components/site/IndustryFilter";
import {
  flattenCategoryNames,
  getPublishedCategories,
  getPublishedIndustries,
  getPublishedInsights,
  getSeoByPath,
} from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry } = await searchParams;
  const seo = await getSeoByPath("/insights");
  return buildMetadata(seo, {
    title: "Industry Insights | Metrra Lab",
    description:
      "Industry notes from Metrra Lab — cosmetics, food and beverage, plastics, electronics, metals, and the verticals you open next.",
    path: industry ? `/insights?industry=${industry}` : "/insights",
  });
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry: industrySlug } = await searchParams;
  const [insights, categories, industries] = await Promise.all([
    getPublishedInsights(industrySlug),
    getPublishedCategories(),
    getPublishedIndustries(),
  ]);
  const active = industries.find((item) => item.slug === industrySlug);

  return (
    <div>
      <header className="bg-abyss px-5 py-20 text-ivory lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Industry Insights</p>
          <h1 className="display mt-4 max-w-3xl text-6xl leading-[0.92]">
            {active ? active.name : "Notes by industry"}
          </h1>
          <p className="mt-6 max-w-2xl text-sand/80">
            Filter by the industry you work in. New verticals can be opened from The Conservatory
            without rebuilding the menu.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <IndustryFilter industries={industries} active={industrySlug} />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {insights.map((item) => (
            <Link key={item.id} href={`/insights/${item.slug}`} className="group">
              <div className="relative h-64 overflow-hidden rounded-3xl">
                <Image
                  src={item.image || "/images/labs/instruments.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              {item.industry && (
                <p className="mt-5 text-[11px] tracking-[0.16em] text-jade uppercase">
                  {item.industry.name}
                </p>
              )}
              <h2 className="display mt-2 text-4xl">{item.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{item.excerpt}</p>
            </Link>
          ))}
          {insights.length === 0 && (
            <p className="text-sm text-ink/55 md:col-span-2">
              No notes in this industry yet. Ask The Conservatory to publish one.
            </p>
          )}
        </div>
        <div className="mt-16 rounded-3xl bg-mist p-8">
          <h2 className="display text-3xl">Brief the editors</h2>
          <div className="mt-5">
            <LeadForm sourcePage="/insights" categories={flattenCategoryNames(categories)} />
          </div>
        </div>
      </div>
    </div>
  );
}
