import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/site/LeadForm";
import { getPublishedCategories, getPublishedInsights } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata(null, {
  title: "Insights | Metrra Lab",
  description: "Notes from the Metrra folio — methods, manners, and the architecture of a protocol.",
  path: "/insights",
});

export default async function InsightsPage() {
  const [insights, categories] = await Promise.all([
    getPublishedInsights(),
    getPublishedCategories(),
  ]);

  return (
    <div>
      <header className="bg-abyss px-5 py-20 text-ivory lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Insights</p>
          <h1 className="display mt-4 text-6xl">From the folio</h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
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
              <h2 className="display mt-5 text-4xl">{item.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{item.excerpt}</p>
            </Link>
          ))}
        </div>
        <div className="mt-16 rounded-3xl bg-mist p-8">
          <h2 className="display text-3xl">Brief the editors</h2>
          <div className="mt-5">
            <LeadForm sourcePage="/insights" categories={categories.map((c) => c.name)} />
          </div>
        </div>
      </div>
    </div>
  );
}
