import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { HouseForm } from "@/components/conservatory/HouseForm";
import { getConservatorySession } from "@/lib/auth";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HousePage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const settings = await getSettings();
  if (!settings) redirect("/conservatory");

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">House</p>
      <h1 className="display mt-2 text-5xl">Address and voice</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        Identity, contact, facility address, hours, map, and tagline. Sector 62 is a facility —
        the public voice is a global laboratory with global solutions.
      </p>
      <HouseForm settings={settings} />
    </ConservatoryShell>
  );
}
