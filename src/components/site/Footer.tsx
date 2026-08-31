import Link from "next/link";
import type { Category, Setting } from "@prisma/client";
import { formatAddress } from "@/lib/data";
import { CookieSettingsLink } from "@/components/site/CookieConsent";
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
    <footer className="border-t border-ink/10 bg-white text-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo className="h-8" src={settings.logoUrl} name={settings.companyName} />
          <p className="mt-6 text-[11px] tracking-[0.2em] text-jade uppercase">
            {settings.identityLine}
          </p>
          <p className="display mt-3 max-w-sm text-2xl leading-snug text-ink">
            {settings.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-ink/65">
            {settings.footerNote}
          </p>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[11px] tracking-[0.22em] text-jade uppercase">The house</p>
          <p className="mt-4 text-sm leading-7 text-ink/75">{formatAddress(settings)}</p>
          <p className="mt-3 text-sm">
            <a className="text-ink underline decoration-ink/30 hover:decoration-ink" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
          <p className="mt-3 text-xs tracking-wide text-ink/50">{settings.hours}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-[11px] tracking-[0.22em] text-jade uppercase">Disciplines</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/75">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link className="hover:text-ink" href={`/disciplines/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[11px] tracking-[0.22em] text-jade uppercase">Request a quote</p>
          <p className="mt-3 mb-4 text-sm text-ink/65">
            Tell us the product and the standard. We reply from {settings.email}.
          </p>
          <LeadForm
            compact
            sourcePage="footer"
            replyTo={settings.email}
            categories={categories.map((item) => item.name)}
          />
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs tracking-[0.14em] text-ink/50 uppercase lg:px-8">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
            <CookieSettingsLink className="uppercase tracking-[0.14em]" />
            <Link href="/conservatory/login">Conservatory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
