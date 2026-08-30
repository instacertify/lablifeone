import { CookieConsent, ConsentScripts } from "@/components/site/CookieConsent";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { LeadDock } from "@/components/site/LeadDock";
import { getPublishedCategories, getSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getPublishedCategories(),
  ]);

  const house = settings ?? {
    id: "house",
    companyName: "Metrra Lab",
    tagline: "BE TESTING BE UNSTOPPABLE",
    email: "contact@metrra.com",
    phone: "+91 120 456 6200",
    addressLine: "A Block, Sector 62, Institutional Area",
    city: "Noida",
    region: "Uttar Pradesh",
    postalCode: "201301",
    country: "India",
    hours: "Monday–Saturday, 09:00–18:30 IST",
    mapEmbed: null,
    linkedin: null,
    aboutExcerpt: "A global laboratory with global solutions.",
    footerNote: "Protocols for industries that cannot afford doubt.",
    logoUrl: "/images/metrra-lab-logo.png",
    identityLine: "A global laboratory with global solutions",
    updatedAt: new Date(),
  };

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
