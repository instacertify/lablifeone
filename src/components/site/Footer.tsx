import Link from "next/link";
import type { Category, Setting } from "@prisma/client";
import { formatAddress } from "@/lib/data";
import { Logo } from "@/components/site/Logo";
import { LeadForm } from "@/components/site/LeadForm";

export function Footer({
  settings,
  categories,
}: {
  settings: Setting;
  categories: Pick<Category, "name" | "slug">[];
}) {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo className="h-8" inverted src={settings.logoUrl} name={settings.companyName} />
          <p className="display mt-6 max-w-sm text-2xl leading-snug text-white">
            {settings.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-mist/80">
            {settings.footerNote}
          </p>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">
            The house
          </p>
          <p className="mt-4 text-sm leading-7 text-sand/90">
            {formatAddress(settings)}
          </p>
          <p className="mt-3 text-sm">
            <a className="text-white underline decoration-white/40 hover:decoration-white" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
          <p className="mt-1 text-sm text-sand/80">{settings.phone}</p>
          <p className="mt-3 text-xs tracking-wide text-mist/70">{settings.hours}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">
            Disciplines
          </p>
          <ul className="mt-4 space-y-2 text-sm text-sand/85">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link className="hover:text-aqua" href={`/disciplines/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">
            Capture a lead
          </p>
          <p className="mt-3 mb-4 text-sm text-sand/80">
            Every page can take a brief. We reply from {settings.email}.
          </p>
          <LeadForm
            compact
            sourcePage="footer"
            replyTo={settings.email}
            categories={categories.map((item) => item.name)}
          />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs tracking-[0.14em] text-mist/60 uppercase lg:px-8">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/conservatory/login">Conservatory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
