import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/components/conservatory/LeadStatus";

export const dynamic = "force-dynamic";

export default async function ChamberPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const [leads, privacyRequests] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.privacyRequest.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Chamber</p>
      <h1 className="display mt-2 text-5xl">Quote requests</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        Briefs sent from Request a quote on the public site. Reply from contact@metrra.com.
      </p>
      <div className="mt-10 divide-y divide-ink/10 rounded-2xl border border-ink/10">
        {leads.map((lead) => (
          <article key={lead.id} className="px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="display text-2xl">{lead.name}</h2>
                <p className="text-sm text-ink/70">
                  {lead.email} {lead.phone ? `· ${lead.phone}` : ""} {lead.company ? `· ${lead.company}` : ""}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.14em] text-aqua uppercase">
                  {lead.sourcePage} {lead.category ? `· ${lead.category}` : ""}
                </p>
              </div>
              <LeadStatus id={lead.id} status={lead.status} />
            </div>
            <p className="mt-3 text-sm leading-7 text-ink/80">{lead.message}</p>
          </article>
        ))}
        {leads.length === 0 && (
          <p className="px-5 py-10 text-sm text-ink/50">No briefs yet. The public doors are open.</p>
        )}
      </div>
      <h2 className="display mt-14 text-3xl">Privacy requests</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        Access, erasure, and other rights filed from the Privacy notice.
      </p>
      <div className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10">
        {privacyRequests.map((request) => (
          <article key={request.id} className="px-5 py-5">
            <p className="text-[11px] tracking-[0.14em] text-aqua uppercase">{request.kind}</p>
            <h3 className="display mt-1 text-2xl">{request.name}</h3>
            <p className="text-sm text-ink/70">{request.email}</p>
            <p className="mt-3 text-sm leading-7 text-ink/80">{request.message}</p>
          </article>
        ))}
        {privacyRequests.length === 0 && (
          <p className="px-5 py-8 text-sm text-ink/50">No privacy requests yet.</p>
        )}
      </div>
    </ConservatoryShell>
  );
}
