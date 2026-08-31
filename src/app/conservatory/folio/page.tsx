import Link from "next/link";
import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { IndustryBoard } from "@/components/conservatory/IndustryBoard";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FolioIndexPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const [pages, insights, industries] = await Promise.all([
    prisma.page.findMany({ orderBy: { updatedAt: "desc" }, include: { seo: true } }),
    prisma.insight.findMany({ orderBy: { updatedAt: "desc" }, include: { industry: true } }),
    prisma.industry.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Folio</p>
      <h1 className="display mt-2 text-5xl">Manuscripts of the house</h1>
      <div className="mt-10 grid gap-4">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`/conservatory/folio/${page.id}`}
            className="rounded-2xl border border-ink/10 p-5 hover:border-aqua/40"
          >
            <p className="text-[11px] tracking-[0.16em] text-ink/50 uppercase">{page.kind}</p>
            <h2 className="display mt-1 text-3xl">{page.title}</h2>
            <p className="mt-2 text-sm text-ink/60">/{page.slug}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex items-end justify-between">
        <h2 className="display text-3xl">Industry Insights</h2>
        <Link href="/conservatory/folio/new-insight" className="text-[12px] tracking-[0.16em] text-aqua uppercase">
          New note
        </Link>
      </div>
      <div className="mt-5 grid gap-3">
        {insights.map((item) => (
          <Link
            key={item.id}
            href={`/conservatory/folio/insight/${item.id}`}
            className="rounded-2xl border border-ink/10 p-4 hover:border-aqua/40"
          >
            <p className="text-[11px] tracking-[0.14em] text-ink/45 uppercase">
              {item.industry?.name || "Unassigned"}
            </p>
            <p className="mt-1">{item.title}</p>
            <p className="mt-1 text-xs text-ink/50">
              Written by {item.writerName || "Metrra Lab"}
              {item.writerRole ? ` · ${item.writerRole}` : ""}
            </p>
          </Link>
        ))}
      </div>
      <IndustryBoard industries={industries} />
    </ConservatoryShell>
  );
}
