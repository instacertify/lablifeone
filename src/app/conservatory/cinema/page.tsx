import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { CinemaBoard } from "@/components/conservatory/CinemaBoard";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CinemaPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Cinema</p>
      <h1 className="display mt-2 text-5xl">Running hero banners</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        The home cinema advances on its own. Upload laboratory images from the Vault and keep the tagline unstoppable.
      </p>
      <CinemaBoard banners={banners} />
    </ConservatoryShell>
  );
}
