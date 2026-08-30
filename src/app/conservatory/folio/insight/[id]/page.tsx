import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { InsightEditor } from "@/components/conservatory/InsightEditor";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InsightEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const { id } = await params;
  const [insight, industries] = await Promise.all([
    prisma.insight.findUnique({ where: { id }, include: { seo: true } }),
    prisma.industry.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!insight) redirect("/conservatory/folio");

  return (
    <ConservatoryShell name={session.name}>
      <InsightEditor insight={insight} industries={industries} />
    </ConservatoryShell>
  );
}
