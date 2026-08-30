import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/components/conservatory/LeadStatus";

export const dynamic = "force-dynamic";

export default async function ChamberPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Chamber</p>
      <h1 className="display mt-2 text-5xl">Leads of the house</h1>
      <p className="mt-3 max-w-2xl text-sm text-sand/70">
        Every public page can capture a brief. Reply from contact@mettra.com.
      </p>
      <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10">
        {leads.map((lead) => (
          <article key={lead.id} className="px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="display text-2xl">{lead.name}</h2>
                <p className="text-sm text-sand/70">
                  {lead.email} {lead.phone ? `· ${lead.phone}` : ""} {lead.company ? `· ${lead.company}` : ""}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.14em] text-aqua uppercase">
                  {lead.sourcePage} {lead.category ? `· ${lead.category}` : ""}
                </p>
              </div>
              <LeadStatus id={lead.id} status={lead.status} />
            </div>
            <p className="mt-3 text-sm leading-7 text-sand/80">{lead.message}</p>
          </article>
        ))}
        {leads.length === 0 && (
          <p className="px-5 py-10 text-sm text-sand/50">No briefs yet. The public doors are open.</p>
        )}
      </div>
    </ConservatoryShell>
  );
}
