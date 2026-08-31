import type { Setting } from "@prisma/client";

export const fallbackHouse: Setting = {
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
