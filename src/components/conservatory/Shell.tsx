import Link from "next/link";
import { LogoMark } from "@/components/site/Logo";

const nav = [
  { href: "/conservatory", label: "Ledger" },
  { href: "/conservatory/folio", label: "Folio" },
  { href: "/conservatory/atelier", label: "Atelier" },
  { href: "/conservatory/cinema", label: "Cinema" },
  { href: "/conservatory/vault", label: "Vault" },
  { href: "/conservatory/compass", label: "Compass" },
  { href: "/conservatory/voices", label: "Voices" },
  { href: "/conservatory/chamber", label: "Chamber" },
  { href: "/conservatory/house", label: "House" },
];

export function ConservatoryShell({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-ink/10 bg-mist px-5 py-6 md:block">
        <Link href="/conservatory" className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="display text-xl leading-none text-ink">Conservatory</p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-jade uppercase">Metrra Lab backstage</p>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-2 text-sm text-ink/70 hover:bg-white hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/logout" method="post" className="absolute bottom-6 left-5 right-5">
          <p className="mb-3 text-[11px] text-ink/45">{name}</p>
          <button className="text-[11px] tracking-[0.16em] text-jade uppercase">Leave the house</button>
        </form>
      </aside>
      <div className="md:pl-60">
        <div className="border-b border-ink/10 bg-white px-5 py-4 md:hidden">
          <p className="display text-2xl">Conservatory</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/60">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white px-5 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
