import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/LeadForm";
import { getCategoryBySlug, getPublishedCategories, getSeoByPath } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const seo = await getSeoByPath(`/disciplines/${slug}`);
  return buildMetadata(seo, {
    title: `${category?.name || "Discipline"} | Mettra`,
    description: category?.excerpt || "A Mettra testing discipline.",
    path: `/disciplines/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getPublishedCategories(),
  ]);
  if (!category || !category.published) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-ink py-24 text-ivory">
        <Image
          src={category.image || "/images/labs/discipline.jpg"}
          alt={category.name}
          fill
          className="object-cover opacity-35"
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Discipline</p>
          <h1 className="display mt-4 text-6xl leading-[0.92]">{category.name}</h1>
          <p className="mt-6 max-w-2xl text-lg text-sand/85">{category.excerpt}</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-8">
          <div
            className="folio-content prose prose-lg max-w-none prose-headings:font-serif"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
          <div className="mt-12 space-y-4">
            {category.services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="block rounded-2xl border border-ink/8 bg-white p-6 hover:border-jade"
              >
                <h2 className="display text-3xl">{service.name}</h2>
                <p className="mt-2 text-sm leading-7 text-ink/70">{service.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl bg-mist p-6">
            <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Lead folio</p>
            <h2 className="display mt-2 text-3xl">Request this discipline</h2>
            <div className="mt-5">
              <LeadForm
                sourcePage={`/disciplines/${slug}`}
                categories={categories.map((item) => item.name)}
              />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
