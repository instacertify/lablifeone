import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { CategoryEditor } from "@/components/conservatory/CategoryEditor";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { seo: true, services: { orderBy: { sortOrder: "asc" } } },
  });
  if (!category) redirect("/conservatory/atelier");

  return (
    <ConservatoryShell name={session.name}>
      <CategoryEditor category={category} />
    </ConservatoryShell>
  );
}
