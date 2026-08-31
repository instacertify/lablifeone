import { LeadForm } from "@/components/site/LeadForm";
import { formatAddress, getPublishedCategories, getSeoByPath, getSettings } from "@/lib/data";
import { safeMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return safeMetadata(() => getSeoByPath("/contact"), {
    title: "Request a Quote | Contact Metrra Lab",
    description: "Write to contact@metrra.com. Metrra Lab is a global laboratory with global solutions.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getPublishedCategories(),
  ]);

  return (
    <div>
      <header className="bg-ink px-5 py-20 text-ivory lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.24em] text-aqua uppercase">Contact</p>
          <h1 className="display mt-4 text-6xl">Request a quote</h1>
          <p className="mt-5 max-w-xl text-sand/80">
            Write to the house by email. Identity, facility address, and hours are editable from The Conservatory.
          </p>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-jade uppercase">The door</p>
          {settings && (
            <div className="mt-4 space-y-3 text-lg">
              <p className="display text-3xl">{settings.companyName}</p>
              <p>{formatAddress(settings)}</p>
              <p>
                <a className="text-jade underline" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </p>
              <p className="text-sm text-ink/60">{settings.hours}</p>
            </div>
          )}
          {settings?.mapEmbed && (
            <iframe
              title="Metrra Lab location"
              src={settings.mapEmbed}
              className="mt-8 h-72 w-full rounded-3xl border-0"
              loading="lazy"
            />
          )}
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="display text-4xl">Request a quote</h2>
          <p className="mt-2 mb-6 text-sm text-ink/65">
            Tell us the product and the standard. We reply from {settings?.email || "contact@metrra.com"}.
          </p>
          <LeadForm
            sourcePage="/contact"
            replyTo={settings?.email || "contact@metrra.com"}
            categories={categories.flatMap((item) => [
                item.name,
                ...item.children.map((child) => child.name),
              ])}
          />
        </div>
      </div>
    </div>
  );
}
