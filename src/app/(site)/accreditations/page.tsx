import { LeadForm } from "@/components/site/LeadForm";
import { getPageBySlug, getPublishedCategories, getSeoByPath } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getSeoByPath("/accreditations");
  return buildMetadata(seo, {
    title: "Seals & Recognitions | Metrra Lab",
    description: "The papers a serious laboratory keeps on the wall.",
    path: "/accreditations",
  });
}

const seals = [
  { name: "ISO/IEC 17025", note: "Competence of testing and calibration laboratories." },
  { name: "Food-system recognition", note: "Sampling and analysis manners for edible goods." },
  { name: "Cosmetic safety practice", note: "Restricted lists, microbiology, stability." },
  { name: "Environmental protocols", note: "Water, effluent, and workplace air." },
];

export default async function AccreditationsPage() {
  const [page, categories] = await Promise.all([
    getPageBySlug("accreditations"),
    getPublishedCategories(),
  ]);

  return (
    <div>
      <header className="bg-ink px-5 py-20 text-ivory lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Seals</p>
          <h1 className="display mt-4 text-6xl">Recognitions of the house</h1>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <div
            className="folio-content prose prose-lg max-w-none prose-headings:font-serif"
            dangerouslySetInnerHTML={{ __html: page?.content || "" }}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {seals.map((seal) => (
              <div key={seal.name} className="rounded-2xl border border-ink/10 bg-white p-5">
                <p className="display text-2xl">{seal.name}</p>
                <p className="mt-2 text-sm text-ink/65">{seal.note}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-mist p-6">
            <h2 className="display text-3xl">Ask for a scope letter</h2>
            <p className="mt-2 mb-5 text-sm text-ink/70">
              Scopes change. Capture the request here; The Conservatory can publish the certificate later.
            </p>
            <LeadForm sourcePage="/accreditations" categories={categories.map((item) => item.name)} />
          </div>
        </aside>
      </div>
    </div>
  );
}
