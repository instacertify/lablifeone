import { redirect } from "next/navigation";
import { ConservatoryShell } from "@/components/conservatory/Shell";
import { PageEditor } from "@/components/conservatory/PageEditor";
import { getConservatorySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getConservatorySession();
  if (!session) redirect("/conservatory/login");
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id }, include: { seo: true } });
  if (!page) redirect("/conservatory/folio");

  return (
    <ConservatoryShell name={session.name}>
      <PageEditor
        id={page.id}
        title={page.title}
        slug={page.slug}
        excerpt={page.excerpt || ""}
        content={page.content}
        seo={{
          path: page.seo?.path || (page.slug === "home" ? "/" : `/${page.slug}`),
          title: page.seo?.title || page.title,
          description: page.seo?.description || page.excerpt || page.title,
          keywords: page.seo?.keywords ?? undefined,
          ogTitle: page.seo?.ogTitle ?? undefined,
          ogDescription: page.seo?.ogDescription ?? undefined,
          ogImage: page.seo?.ogImage ?? undefined,
          canonical: page.seo?.canonical ?? undefined,
          robots: page.seo?.robots ?? undefined,
          schemaJson: page.seo?.schemaJson ?? undefined,
          focusKeyword: page.seo?.focusKeyword ?? undefined,
        }}
      />
    </ConservatoryShell>
  );
}
