import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/LeadForm";
import { getPublishedCategories, getSeoByPath, getServiceBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const seo = await getSeoByPath(`/services/${slug}`);
  return buildMetadata(seo, {
    title: `${service?.name || "Service"} | Metrra Lab`,
    description: service?.excerpt || "A Metrra assay.",
    path: `/services/${slug}`,
  });
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

  return (
    <article>
      <header className="bg-abyss px-5 py-20 text-ivory lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/disciplines/${service.category.slug}`}
            className="text-[11px] tracking-[0.24em] text-aqua uppercase"
          >
            {service.category.name}
          </Link>
          <h1 className="display mt-4 text-6xl leading-[0.92]">{service.name}</h1>
          <p className="mt-6 max-w-2xl text-sand/80">{service.excerpt}</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-8">
          {service.image && (
            <div className="relative mb-10 h-80 overflow-hidden rounded-3xl">
              <Image src={service.image} alt={service.name} fill className="object-cover" />
            </div>
          )}
          <div
            className="folio-content prose prose-lg max-w-none prose-headings:font-serif"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-3xl bg-mist p-6">
            <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Capture a lead</p>
            <h2 className="display mt-2 text-3xl">Request a quote</h2>
            <div className="mt-5">
              <LeadForm sourcePage={`/services/${slug}`} categories={categories.map((item) => item.name)} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
