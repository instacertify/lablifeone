import Link from "next/link";
import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewCategoryForm } from "@/components/conservatory/NewCategoryForm";

export const dynamic = "force-dynamic";

export default async function AtelierPage() {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { services: true },
  });

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Atelier</p>
      <h1 className="display mt-2 text-5xl">Disciplines of the house</h1>
      <p className="mt-3 max-w-2xl text-sm text-sand/70">
        Add food, cosmetics, electronics, or any new category. Each wing receives a public
        landing, SEO compass, and a lead door.
      </p>
      <div className="mt-10 grid gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/conservatory/atelier/${category.id}`}
            className="rounded-2xl border border-white/10 p-5 hover:border-aqua/40"
          >
            <h2 className="display text-3xl">{category.name}</h2>
            <p className="mt-2 text-sm text-sand/60">{category.excerpt}</p>
            <p className="mt-3 text-[11px] tracking-[0.16em] text-aqua uppercase">
              {category.services.length} services
            </p>
          </Link>
        ))}
      </div>
      <NewCategoryForm />
    </ConservatoryShell>
  );
}
