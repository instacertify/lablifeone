import Link from "next/link";
import type { Category, Setting } from "@prisma/client";
import { Logo } from "@/components/site/Logo";

const links = [
  { href: "/about", label: "The House" },
  { href: "/disciplines", label: "Disciplines" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  categories,
  settings,
}: {
  categories: Pick<Category, "name" | "slug">[];
  settings?: Pick<Setting, "companyName" | "logoUrl"> | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-ivory backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 lg:px-8">
        <Link href="/" className="shrink-0">
          <Logo
            className="h-9"
            inverted
            src={settings?.logoUrl}
            name={settings?.companyName || "Metrra Lab"}
          />
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] tracking-[0.14em] uppercase md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/75 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.slug}
              href={`/disciplines/${category.slug}`}
              className="hidden text-white/55 transition hover:text-white xl:inline"
            >
              {category.name.split("&")[0].trim()}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-white px-4 py-2 text-[12px] font-medium tracking-[0.16em] text-ink uppercase transition hover:bg-sand"
        >
          Request a quote
        </Link>
      </div>
    </header>
  );
}
