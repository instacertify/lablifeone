import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/site/LeadForm";
import { flattenCategoryNames, getPublishedCategories, getSeoByPath } from "@/lib/data";
import { safeMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return safeMetadata(() => getSeoByPath("/disciplines"), {
    title: "Testing Disciplines | Metrra Lab",
    description:
      "Food, cosmetics, electronics, metals, polymers, and every category the Conservatory opens next — all under Disciplines.",
    path: "/disciplines",
  });
}

export default async function DisciplinesPage() {
  const categories = await getPublishedCategories();

  return (
    <div>
      <header className="bg-abyss px-5 py-20 text-ivory lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Disciplines</p>
          <h1 className="display mt-4 max-w-3xl text-6xl leading-[0.92]">
            One menu. Every discipline.
          </h1>
          <p className="mt-6 max-w-2xl text-sand/80">
            Food, cosmetics, electronics, metals, polymers — they are not separate headings.
            They live as a submenu under Disciplines, with subcategories and tests the Conservatory
            can generate at any time.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <article
              key={category.id}
              className="overflow-hidden rounded-3xl border border-ink/8 bg-white"
            >
              <Link href={`/disciplines/${category.slug}`} className="block">
                <div className="relative h-56">
                  <Image
                    src={category.image || "/images/labs/discipline.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="display text-4xl">{category.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/70">{category.excerpt}</p>
                  <p className="mt-4 text-[11px] tracking-[0.16em] text-jade uppercase">
                    {category.services.length} tests · {category.children.length} subcategories
                  </p>
                </div>
              </Link>
              {category.children.length > 0 && (
                <ul className="space-y-2 border-t border-ink/8 px-6 py-4 text-sm">
                  {category.children.map((child) => (
                    <li key={child.id}>
                      <Link href={`/disciplines/${child.slug}`} className="flex justify-between hover:text-jade">
                        <span>{child.name}</span>
                        <span className="text-ink/40">{child.services.length} tests</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
        <div className="mt-16 rounded-3xl bg-mist p-8">
          <h2 className="display text-4xl">Need a category that is not listed?</h2>
          <p className="mt-3 mb-6 max-w-xl text-sm text-ink/70">
            Tell us the discipline. The Conservatory can publish a new category — and as many
            subcategories and tests as the brief needs — without rebuilding the site.
          </p>
          <LeadForm sourcePage="/disciplines" categories={flattenCategoryNames(categories)} />
        </div>
      </div>
    </div>
  );
}
