import { CookieConsent, ConsentScripts } from "@/components/site/CookieConsent";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { LeadDock } from "@/components/site/LeadDock";
import { getPublishedCategories, getSettings } from "@/lib/data";
import { fallbackHouse } from "@/lib/house";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  let categories: Awaited<ReturnType<typeof getPublishedCategories>> = [];
  try {
    [settings, categories] = await Promise.all([
      getSettings(),
      getPublishedCategories(),
    ]);
  } catch (error) {
    console.error(error);
  }

  const house = settings ?? fallbackHouse;

  return (
    <div className="flex min-h-full flex-col">
      <JsonLd settings={house} />
      <Header categories={categories} settings={house} />
      <main className="flex-1">{children}</main>
      <Footer settings={house} categories={categories} />
      <LeadDock
        categories={categories.flatMap((item) => [
          item.name,
          ...item.children.map((child) => child.name),
        ])}
        sourcePage="/"
      />
      <CookieConsent />
      <ConsentScripts />
    </div>
  );
}
