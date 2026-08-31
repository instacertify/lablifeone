import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/LeadForm";
import {
  flattenCategoryNames,
  getPublishedCategories,
  getSeoByPath,
  getServiceBySlug,
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
    const service = await getServiceBySlug(slug);
    return safeMetadata(() => getSeoByPath(`/services/${slug}`), {
      title: `${service?.name || "Service"} | Metrra Lab`,
      description: service?.excerpt || "A Metrra assay.",
      path: `/services/${slug}`,
    });
  } catch {
    return safeMetadata(async () => null, {
      title: "Service | Metrra Lab",
      description: "A Metrra assay.",
      path: `/services/${slug}`,
    });
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, categories] = await Promise.all([
    getServiceBySlug(slug),
    getPublishedCategories(),
  ]);
  if (!service || !service.published) notFound();

  const specs = [
    ["Standard", service.standard],
    ["Timeline", service.timeline],
    ["Method", service.method],
    ["Sample", service.sample],
    ["Notes", service.notes],
  ].filter(([, value]) => Boolean(value));

  return (
    <article>
      <header className="border-b border-ink/10 bg-white px-5 py-20 text-ink lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/disciplines/${service.category.slug}`}
            className="text-[11px] tracking-[0.24em] text-jade uppercase"
          >
            {service.category.name}
          </Link>
          <h1 className="display mt-4 text-6xl leading-[0.92]">{service.name}</h1>
          <p className="mt-6 max-w-2xl text-ink/70">{service.excerpt}</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-8">
          {service.image && (
            <div className="relative mb-10 h-80 overflow-hidden rounded-3xl">
              <Image src={service.image} alt={service.name} fill className="object-cover" />
            </div>
          )}
          {specs.length > 0 && (
            <dl className="mb-10 grid gap-4 rounded-3xl border border-ink/8 bg-white p-6 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">{label}</dt>
                  <dd className="mt-1 text-sm leading-6 text-ink/80">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div
            className="folio-content prose prose-lg max-w-none prose-headings:font-serif"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-3xl bg-mist p-6">
            <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Request a quote</p>
            <h2 className="display mt-2 text-3xl">Request a quote</h2>
            <div className="mt-5">
              <LeadForm
                sourcePage={`/services/${slug}`}
                categories={flattenCategoryNames(categories)}
              />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
