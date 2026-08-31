import Link from "next/link";
import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

const practices = [
  "Write a unique title of 45–60 characters with the focus phrase near the front.",
  "Keep meta descriptions at 140–160 characters and make a specific promise.",
  "Give every page a canonical https URL on www.metrra.com.",
  "Attach a 1200×630 Open Graph image from the Vault.",
  "Use one H1 in the public template; start Folio copy with H2.",
  "Name images with alt text before they leave the Vault.",
  "Keep robots on index,follow unless the page is private.",
  "Add supporting keywords, then let the sitemap and robots.txt do the rest.",
  "JSON-LD for the laboratory is emitted automatically from House details.",
];

export default async function CompassPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const records = await prisma.seoRecord.findMany({ orderBy: { path: "asc" } });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Compass</p>
      <h1 className="display mt-2 text-5xl">SEO practice of the house</h1>
      <ol className="mt-8 space-y-2 text-sm text-ink/75">
        {practices.map((practice, index) => (
          <li key={practice} className="flex gap-3">
            <span className="font-mono text-aqua">{String(index + 1).padStart(2, "0")}</span>
            {practice}
          </li>
        ))}
      </ol>
      <div className="mt-12 divide-y divide-ink/10 rounded-2xl border border-ink/10">
        {records.map((record) => {
          const score = evaluateSeo(record);
          return (
            <div key={record.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-ink">{record.path}</p>
                <p className="text-xs text-ink/50">{record.title}</p>
              </div>
              <p className="font-mono text-aqua">
                {score.score} {score.grade}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-ink/60">
        Edit titles and descriptions inside each Folio or Atelier manuscript.{" "}
        <Link className="text-aqua" href="/conservatory/folio">
          Open the Folio
        </Link>
        .
      </p>
    </ConservatoryShell>
  );
}
