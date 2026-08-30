import Link from "next/link";
import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LedgerPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");

  const [leads, categories, pages, media] = await Promise.all([
    prisma.lead.count(),
    prisma.category.count(),
    prisma.page.count(),
    prisma.mediaAsset.count(),
  ]);
  const recent = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Ledger</p>
      <h1 className="display mt-2 text-5xl">The house at a glance</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Leads in the Chamber", leads, "/conservatory/chamber"],
          ["Disciplines", categories, "/conservatory/atelier"],
          ["Folio pages", pages, "/conservatory/folio"],
          ["Vault images", media, "/conservatory/vault"],
        ].map(([label, value, href]) => (
          <Link key={String(href)} href={String(href)} className="rounded-2xl border border-white/10 p-5">
            <p className="text-[11px] tracking-[0.16em] text-sand/50 uppercase">{label}</p>
            <p className="display mt-3 text-4xl text-aqua">{value}</p>
          </Link>
        ))}
      </div>
      <h2 className="display mt-14 text-3xl">Latest briefs</h2>
      <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10">
        {recent.map((lead) => (
          <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="text-ivory">{lead.name}</p>
              <p className="text-xs text-sand/50">
                {lead.email} · {lead.sourcePage}
              </p>
            </div>
            <p className="text-xs tracking-[0.14em] text-aqua uppercase">{lead.status}</p>
          </div>
        ))}
        {recent.length === 0 && (
          <p className="px-5 py-8 text-sm text-sand/50">The Chamber is quiet.</p>
        )}
      </div>
    </ConservatoryShell>
  );
}
