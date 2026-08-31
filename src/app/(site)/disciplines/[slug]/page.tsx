import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/LeadForm";
import {
  flattenCategoryNames,
  getCategoryBySlug,
  getPublishedCategories,
  getSeoByPath,
} from "@/lib/data";
import { safeMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return safeMetadata(() => getSeoByPath(`/disciplines/${slug}`), {
      title: `${category?.name || "Discipline"} | Metrra Lab`,
      description: category?.excerpt || "A Metrra testing discipline.",
      path: `/disciplines/${slug}`,
    });
  } catch {
    return safeMetadata(async () => null, {
      title: "Discipline | Metrra Lab",
      description: "A Metrra testing discipline.",
      path: `/disciplines/${slug}`,
    });
  }
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
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">
            <Link href="/disciplines" className="hover:text-white">
              Disciplines
            </Link>
            {category.parent && (
              <>
                <span className="mx-2 text-white/30">/</span>
                <Link href={`/disciplines/${category.parent.slug}`} className="hover:text-white">
                  {category.parent.name}
                </Link>
              </>
            )}
          </p>
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

          {category.children.length > 0 && (
            <section className="mt-12">
              <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Subcategories</p>
              <h2 className="display mt-2 text-4xl">Wings inside this discipline</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/disciplines/${child.slug}`}
                    className="rounded-2xl border border-ink/8 bg-white p-5 hover:border-jade"
                  >
                    <h3 className="display text-2xl">{child.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{child.excerpt}</p>
                    <p className="mt-3 text-[11px] tracking-[0.14em] text-jade uppercase">
                      {child.services.length} tests
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {category.services.length > 0 && (
            <section className="mt-12">
              <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Tests</p>
              <h2 className="display mt-2 text-4xl">Standards and timelines</h2>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/8">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-mist text-[11px] tracking-[0.16em] text-ink/60 uppercase">
                    <tr>
                      <th className="px-4 py-3 font-medium">Test</th>
                      <th className="px-4 py-3 font-medium">Standard</th>
                      <th className="px-4 py-3 font-medium">Timeline</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.services.map((service) => (
                      <tr key={service.id} className="border-t border-ink/8">
                        <td className="px-4 py-4">
                          <Link href={`/services/${service.slug}`} className="font-medium hover:text-jade">
                            {service.name}
                          </Link>
                          <p className="mt-1 text-xs text-ink/55">{service.excerpt}</p>
                        </td>
                        <td className="px-4 py-4 text-ink/75">{service.standard || "On request"}</td>
                        <td className="px-4 py-4 text-ink/75">{service.timeline || "On request"}</td>
                        <td className="px-4 py-4 text-ink/75">{service.method || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl bg-mist p-6">
            <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Lead folio</p>
            <h2 className="display mt-2 text-3xl">Request this discipline</h2>
            <div className="mt-5">
              <LeadForm
                sourcePage={`/disciplines/${slug}`}
                categories={flattenCategoryNames(categories)}
              />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
