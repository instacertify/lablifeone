import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { VaultBoard } from "@/components/conservatory/VaultBoard";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Vault</p>
      <h1 className="display mt-2 text-5xl">Images of the house</h1>
      <p className="mt-3 max-w-2xl text-sm text-sand/70">
        Upload laboratory photography for heroes, disciplines, and the Folio editor.
      </p>
      <VaultBoard assets={assets} />
    </ConservatoryShell>
  );
}
