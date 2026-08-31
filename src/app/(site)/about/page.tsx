import Image from "next/image";
import { LeadForm } from "@/components/site/LeadForm";
import { flattenCategoryNames, getPageBySlug, getPublishedCategories, getSeoByPath, getSettings } from "@/lib/data";
import { safeMetadata } from "@/lib/metadata";
import { formatAddress } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return safeMetadata(() => getSeoByPath("/about"), {
    title: "The House | Metrra Lab",
    description: "A global laboratory with global solutions. One facility among the work — never the identity.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [page, settings, categories] = await Promise.all([
    getPageBySlug("about"),
    getSettings(),
    getPublishedCategories(),
  ]);

  return (
    <article>
      <header className="relative overflow-hidden bg-ink py-24 text-ivory">
        <Image
          src="/images/labs/discipline.jpg"
          alt="Metrra laboratory"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">The house</p>
          <h1 className="display mt-4 max-w-3xl text-6xl leading-[0.92]">
            {settings?.identityLine || "A global laboratory with global solutions."}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-sand/85">
            A laboratory facility — not the brand identity — at{" "}
            {settings ? formatAddress(settings) : "the address held in The Conservatory"}.
          </p>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div
          className="folio-content prose prose-lg lg:col-span-8 prose-headings:font-serif"
          dangerouslySetInnerHTML={{
            __html:
              page?.content ||
              "<p>Metrra Lab is a global laboratory with global solutions.</p>",
          }}
        />
        <aside className="lg:col-span-4">
          <div className="rounded-3xl bg-mist p-6">
            <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Write to the house</p>
            <h2 className="display mt-2 text-3xl">A brief, from this page</h2>
            <div className="mt-5">
              <LeadForm
                sourcePage="/about"
                categories={flattenCategoryNames(categories)}
              />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
