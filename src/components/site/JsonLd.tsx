import { formatAddress } from "@/lib/data";
import { siteUrl } from "@/lib/seo";
import type { Setting } from "@prisma/client";

export function JsonLd({
  settings,
  extra,
}: {
  settings: Setting;
  extra?: Record<string, unknown>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalLaboratory",
    name: settings.companyName,
    slogan: settings.tagline,
    email: settings.email,
    telephone: settings.phone,
    url: siteUrl("/"),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine,
      addressLocality: settings.city,
      addressRegion: settings.region,
      postalCode: settings.postalCode,
      addressCountry: settings.country,
    },
    description: settings.aboutExcerpt,
    image: siteUrl("/images/labs/hero-3.jpg"),
    ...extra,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function addressLine(settings: Setting) {
  return formatAddress(settings);
}
