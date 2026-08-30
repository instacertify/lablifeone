import Link from "next/link";
import type { Category } from "@prisma/client";
import { Logo } from "@/components/site/Logo";

const links = [
  { href: "/about", label: "The House" },
  { href: "/disciplines", label: "Disciplines" },
  { href: "/accreditations", label: "Seals" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  categories,
}: {
  categories: Pick<Category, "name" | "slug">[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 text-ivory backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 lg:px-8">
        <Link href="/" className="shrink-0 [&_span]:text-ivory">
          <Logo className="h-8" />
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] tracking-[0.14em] uppercase md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sand/80 transition hover:text-aqua"
            >
              {link.label}
            </Link>
          ))}
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.slug}
              href={`/disciplines/${category.slug}`}
              className="hidden text-sand/60 transition hover:text-aqua xl:inline"
            >
              {category.name.split("&")[0].trim()}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-aqua px-4 py-2 text-[12px] font-medium tracking-[0.16em] text-ink uppercase transition hover:bg-white"
        >
          Request assay
        </Link>
      </div>
    </header>
  );
}
