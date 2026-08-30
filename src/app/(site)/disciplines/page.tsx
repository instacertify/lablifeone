import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/site/LeadForm";
import { getPublishedCategories, getSeoByPath } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getSeoByPath("/disciplines");
  return buildMetadata(seo, {
    title: "Testing Disciplines | Metrra Lab",
    description: "Food, cosmetics, electronics, and every category the Conservatory opens next.",
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
            Categories the house can grow.
          </h1>
          <p className="mt-6 max-w-2xl text-sand/80">
            Food, cosmetics, electronics — and any wing you open from The Conservatory.
            Each landing collects a lead.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/disciplines/${category.slug}`}
              className="overflow-hidden rounded-3xl border border-ink/8 bg-white"
            >
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
                  {category.services.length} services in this wing
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16 rounded-3xl bg-mist p-8">
          <h2 className="display text-4xl">Need a category that is not listed?</h2>
          <p className="mt-3 mb-6 max-w-xl text-sm text-ink/70">
            Tell us the discipline. The Conservatory can publish a new category — food,
            cosmetic, electronics, or whatever the market invents — with its own SEO folio.
          </p>
          <LeadForm
            sourcePage="/disciplines"
            categories={categories.map((item) => item.name)}
          />
        </div>
      </div>
    </div>
  );
}
