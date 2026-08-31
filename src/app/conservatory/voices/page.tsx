import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { VoicesBoard } from "@/components/conservatory/VoicesBoard";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VoicesPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const voices = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-white uppercase">Voices</p>
      <h1 className="display mt-2 text-5xl">Testimonial library</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        Keep the public house honest. Add, retire, and reorder the voices that appear on the home page.
      </p>
      <VoicesBoard voices={voices} />
    </ConservatoryShell>
  );
}
