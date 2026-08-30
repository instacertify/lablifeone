import Image from "next/image";
import Link from "next/link";
import { HeroCinema } from "@/components/site/HeroCinema";
import { LeadForm } from "@/components/site/LeadForm";
import { TestimonialLibrary } from "@/components/site/TestimonialLibrary";
import { Ticker } from "@/components/site/Ticker";
import {
  getBanners,
  getFaqs,
  getPageBySlug,
  getPublishedCategories,
  getPublishedInsights,
  getPublishedTestimonials,
  getSeoByPath,
  getSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getSeoByPath("/");
  return buildMetadata(seo, {
    title: "Metrra Lab | A global laboratory with global solutions",
    description:
      "Metrra Lab is a global laboratory with global solutions. Food, cosmetics, electronics, metals, polymers, and every discipline you commission. Be testing. Be unstoppable.",
    path: "/",
  });
}

const steps = [
  { n: "01", title: "Brief", copy: "Tell us the product, the market, and the standard that must be satisfied." },
  { n: "02", title: "Protocol", copy: "We write the method as architecture — instruments, uncertainty, the sentence you will need." },
  { n: "03", title: "Assay", copy: "Rooms kept at the right humidity. No theatre of rush." },
  { n: "04", title: "Dossier", copy: "A number you can stand beside in a meeting, and a file a regulator can read." },
];

export default async function HomePage() {
  const [banners, categories, settings, faqs, page, insights, voices] = await Promise.all([
    getBanners(),
    getPublishedCategories(),
    getSettings(),
    getFaqs(),
    getPageBySlug("home"),
    getPublishedInsights(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <HeroCinema banners={banners} identityLine={settings?.identityLine} />
      <Ticker text={settings?.tagline || "BE TESTING BE UNSTOPPABLE"} />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[11px] tracking-[0.24em] text-jade uppercase">The house</p>
            <h2 className="display mt-3 text-5xl leading-[0.95] text-ink">
              {settings?.identityLine || "A global laboratory with global solutions."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <div
              className="folio-content prose prose-lg max-w-none prose-headings:font-serif prose-p:text-ink/75"
              dangerouslySetInnerHTML={{
                __html:
                  page?.content ||
                  "<p>Metrra Lab is a global laboratory with global solutions — protocols written for brands that cannot afford doubt, wherever they ship.</p>",
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-abyss py-20 text-ivory">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">
                Disciplines
              </p>
              <h2 className="display mt-3 text-5xl">Open a wing of the house</h2>
            </div>
            <Link href="/disciplines" className="text-[12px] tracking-[0.16em] text-aqua uppercase">
              All categories →
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/disciplines/${category.slug}`}
                className="group overflow-hidden rounded-3xl bg-ink"
              >
                <div className="relative h-52">
                  <Image
                    src={category.image || "/images/labs/discipline.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] tracking-[0.2em] text-aqua uppercase">
                    {category.accent}
                  </p>
                  <h3 className="display mt-2 text-3xl">{category.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-sand/80">{category.excerpt}</p>
                  {category.children.length > 0 && (
                    <p className="mt-3 text-[11px] tracking-[0.14em] text-aqua/80 uppercase">
                      {category.children.map((child) => child.name).join(" · ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <p className="text-[11px] tracking-[0.24em] text-jade uppercase">The work</p>
        <h2 className="display mt-3 text-5xl">Four rooms, one dossier</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article key={step.n} className="rounded-3xl border border-ink/8 bg-white p-6">
              <p className="font-mono text-jade">{step.n}</p>
              <h3 className="display mt-4 text-3xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink/65">{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest py-20 text-ivory">
        <Image
          src="/images/labs/precision.jpg"
          alt="Metrra Lab instruments"
          fill
          className="object-cover opacity-20"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Industry Insights</p>
            <h2 className="display mt-3 text-5xl">Notes by industry</h2>
            <div className="mt-8 space-y-6">
              {insights.map((item) => (
                <Link key={item.id} href={`/insights/${item.slug}`} className="block">
                  {item.industry && (
                    <p className="text-[11px] tracking-[0.16em] text-aqua/70 uppercase">
                      {item.industry.name}
                    </p>
                  )}
                  <h3 className="display mt-1 text-3xl hover:text-aqua">{item.title}</h3>
                  <p className="mt-1 text-[12px] text-sand/65">
                    Written by {item.writerName || "Metrra Lab"}
                    {item.writerRole ? ` · ${item.writerRole}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-sand/80">{item.excerpt}</p>
                </Link>
              ))}
            </div>
            <Link href="/insights" className="mt-8 inline-block text-[12px] tracking-[0.16em] text-aqua uppercase">
              All industry insights →
            </Link>
          </div>
          <div className="rounded-3xl bg-ink/70 p-8 backdrop-blur">
            <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">
              Request a quote
            </p>
            <h3 className="display mt-2 text-4xl">Ask Metrra Lab for a quote</h3>
            <p className="mt-3 mb-6 text-sm text-sand/80">
              Every public page can take a brief. Reply from{" "}
              {settings?.email || "contact@metrra.com"}.
            </p>
            <LeadForm
              dark
              sourcePage="/"
              replyTo={settings?.email || "contact@metrra.com"}
              categories={categories.flatMap((item) => [
                item.name,
                ...item.children.map((child) => child.name),
              ])}
            />
          </div>
        </div>
      </section>

      <TestimonialLibrary voices={voices} />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <h2 className="display text-5xl">Asked of the house</h2>
        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="cursor-pointer list-none display text-2xl">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
