import Link from "next/link";
import type { Category, Setting } from "@prisma/client";
import { DisciplinesMenu } from "@/components/site/DisciplinesMenu";
import { Logo } from "@/components/site/Logo";

type NavCategory = Pick<Category, "name" | "slug"> & {
  children?: Pick<Category, "name" | "slug">[];
};

export function Header({
  categories,
  settings,
}: {
  categories: NavCategory[];
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
          <Link href="/about" className="text-white/75 transition hover:text-white">
            The House
          </Link>
          <DisciplinesMenu categories={categories} />
          <Link href="/insights" className="text-white/75 transition hover:text-white">
            Insights
          </Link>
          <Link href="/contact" className="text-white/75 transition hover:text-white">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none text-[11px] tracking-[0.16em] text-white/80 uppercase">
              Menu
            </summary>
            <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-white/10 bg-ink p-4 shadow-2xl">
              <Link href="/about" className="block py-1.5 text-sm text-white/80">
                The House
              </Link>
              <p className="mt-3 text-[10px] tracking-[0.2em] text-white/40 uppercase">Disciplines</p>
              <ul className="mt-2 space-y-1 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/disciplines/${category.slug}`} className="text-white hover:underline">
                      {category.name}
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <ul className="mt-1 ml-3 space-y-0.5 text-xs text-white/55">
                        {category.children.map((child) => (
                          <li key={child.slug}>
                            <Link href={`/disciplines/${child.slug}`}>{child.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <Link href="/insights" className="mt-3 block py-1.5 text-sm text-white/80">
                Insights
              </Link>
              <Link href="/contact" className="block py-1.5 text-sm text-white/80">
                Contact
              </Link>
            </div>
          </details>
          <Link
            href="/contact"
            className="rounded-full bg-white px-4 py-2 text-[12px] font-medium tracking-[0.16em] text-ink uppercase transition hover:bg-sand"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </header>
  );
}
