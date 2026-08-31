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
    include: {
      services: true,
      children: {
        orderBy: { sortOrder: "asc" },
        include: { services: true },
      },
    },
  });
  const roots = categories.filter((category) => !category.parentId);

  return (
    <ConservatoryShell name={session.name}>
      <p className="text-[11px] tracking-[0.22em] text-aqua uppercase">Atelier</p>
      <h1 className="display mt-2 text-5xl">Disciplines of the house</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/70">
        Every discipline lives under the public Disciplines menu — never as its own top heading.
        Open multiple categories, nest subcategories, and generate tests with standards and timelines
        from this room.
      </p>
      <div className="mt-10 grid gap-4">
        {roots.map((category) => (
          <div key={category.id} className="rounded-2xl border border-ink/10 p-5">
            <Link href={`/conservatory/atelier/${category.id}`} className="block hover:text-ink">
              <h2 className="display text-3xl">{category.name}</h2>
              <p className="mt-2 text-sm text-ink/60">{category.excerpt}</p>
              <p className="mt-3 text-[11px] tracking-[0.16em] text-aqua uppercase">
                {category.services.length} tests · {category.children.length} subcategories
              </p>
            </Link>
            {category.children.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link href={`/conservatory/atelier/${child.id}`} className="flex items-center justify-between text-sm text-ink/75 hover:text-ink">
                      <span>{child.name}</span>
                      <span className="text-[11px] tracking-[0.14em] text-ink/45 uppercase">
                        {child.services.length} tests
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <NewCategoryForm parents={roots.map((item) => ({ id: item.id, name: item.name }))} />
    </ConservatoryShell>
  );
}
