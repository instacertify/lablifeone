import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.CONSERVATORY_PASSWORD || "Unstoppable2026",
    12,
  );

  await prisma.admin.upsert({
    where: { email: process.env.CONSERVATORY_EMAIL || "conservatory@metrra.com" },
    update: { passwordHash, name: "Conservatory" },
    create: {
      email: process.env.CONSERVATORY_EMAIL || "conservatory@metrra.com",
      passwordHash,
      name: "Conservatory",
    },
  });

  const houseFields = {
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
    mapEmbed:
      "https://www.google.com/maps?q=A+Block+Sector+62+Institutional+Area+Noida+201301&output=embed",
    linkedin: "https://www.linkedin.com",
    aboutExcerpt:
      "Metrra Lab is a high-house of analytical testing in Noida’s institutional corridor — European in discipline, Indian in presence, exacting in every dossier.",
    footerNote:
      "Protocols written for industries that cannot afford doubt. Food, cosmetics, electronics, and every discipline you commission next.",
    logoUrl: "/images/metrra-lab-logo.png",
  };

  await prisma.setting.upsert({
    where: { id: "house" },
    update: houseFields,
    create: {
      id: "house",
      ...houseFields,
    },
  });

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      {
        title: "The assay is the argument.",
        subtitle: "A Noida house of measurement with a European sense of finish.",
        image: "/images/labs/hero-1.jpg",
        ctaLabel: "Commission a protocol",
        ctaHref: "/contact",
        sortOrder: 0,
        active: true,
      },
      {
        title: "Be testing. Be unstoppable.",
        subtitle: "Food, cosmetics, electronics — and every category you add to the ledger.",
        image: "/images/labs/hero-2.jpg",
        ctaLabel: "Explore disciplines",
        ctaHref: "/disciplines",
        sortOrder: 1,
        active: true,
      },
      {
        title: "Legacy, under glass.",
        subtitle: "Instruments, scientists, and a workflow that treats every sample as a reputation.",
        image: "/images/labs/hero-3.jpg",
        ctaLabel: "Visit the house",
        ctaHref: "/about",
        sortOrder: 2,
        active: true,
      },
    ],
  });

  await prisma.service.deleteMany();
  await prisma.category.deleteMany();

  const food = await prisma.category.create({
    data: {
      name: "Food & Nutrition",
      slug: "food-nutrition",
      excerpt: "Composition, contaminants, authenticity, and fortification for brands that feed people.",
      description: `<p>Metrra’s food atelier reads a product the way a sommelier reads a vintage — origin, integrity, and what must never be present. From residues to nutrition panels, every assay is written for regulators, retailers, and the people who will actually eat the thing.</p><h3>What we hold to account</h3><ul><li>Pesticide residues, heavy metals, and mycotoxins</li><li>Nutritional labelling and fortification recovery</li><li>Pathogen screens and shelf-life studies</li><li>Authenticity and adulteration dossiers</li></ul>`,
      image: "/images/labs/food.jpg",
      accent: "aqua",
      sortOrder: 0,
      services: {
        create: [
          {
            name: "Residue & Contaminant Dossier",
            slug: "food-residue-contaminants",
            excerpt: "Multi-residue pesticide, metal, and mycotoxin profiles for export and domestic release.",
            description:
              "<p>A complete contaminant folio for food manufacturers, exporters, and private-label houses. Methods aligned to national and international residue definitions, written so a quality lead can defend the number in a meeting.</p>",
            image: "/images/labs/assay.jpg",
            sortOrder: 0,
          },
          {
            name: "Nutrition & Fortification Assay",
            slug: "nutrition-fortification",
            excerpt: "Label-ready nutrition facts and vitamin/mineral recovery for fortified foods.",
            description:
              "<p>We quantify what the pack claims — protein, fats, sugars, micronutrients — and recover fortificants with the patience a label audit deserves.</p>",
            image: "/images/labs/chemistry.jpg",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const cosmetics = await prisma.category.create({
    data: {
      name: "Cosmetics & Personal Care",
      slug: "cosmetics-personal-care",
      excerpt: "Safety, stability, and claim support for formulas that sit on skin.",
      description: `<p>A cosmetic is a contract with the face. Metrra’s personal-care bench treats emulsions, serums, and ayurvedic preparations with the same severity we give a drug impurity profile — restricted substances, microbiology, and the quiet work of proving a claim.</p><h3>The folio</h3><ul><li>Restricted substances and heavy metals</li><li>Preservative efficacy and microbial limits</li><li>Stability, compatibility, and packaging interaction</li><li>Herbal and natural-origin substantiation</li></ul>`,
      image: "/images/labs/cosmetics.jpg",
      accent: "iris",
      sortOrder: 1,
      services: {
        create: [
          {
            name: "Cosmetic Safety Screen",
            slug: "cosmetic-safety-screen",
            excerpt: "Restricted lists, metals, and microbiology for leave-on and rinse-off formulas.",
            description:
              "<p>From lipstick to lotion, we map the formula against restricted-substance lists and microbial limits so a brand can ship with a straight face.</p>",
            image: "/images/labs/cosmetics.jpg",
            sortOrder: 0,
          },
          {
            name: "Stability & Claim Support",
            slug: "cosmetic-stability-claims",
            excerpt: "Accelerated stability, packaging interaction, and evidence for marketing language.",
            description:
              "<p>We age the formula, watch the pack, and write the evidence a claim actually needs — not the evidence a campaign wishes it had.</p>",
            image: "/images/labs/precision.jpg",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics & Electrical",
      slug: "electronics-electrical",
      excerpt: "Materials, restricted substances, and reliability for objects that carry current.",
      description: `<p>Electronics fail quietly until they do not. Metrra’s electrical bench looks at solder, polymers, coatings, and assemblies the way a conservator looks at a clock — composition, restricted chemistry, and the manners of heat.</p><h3>Scope</h3><ul><li>Restricted substance screening for materials declarations</li><li>Polymer and coating identification</li><li>Corrosion, plating, and cleanliness</li><li>Incoming inspection for critical parts</li></ul>`,
      image: "/images/labs/electronics.jpg",
      accent: "bronze",
      sortOrder: 2,
      services: {
        create: [
          {
            name: "Restricted Substance Screen",
            slug: "electronics-restricted-substances",
            excerpt: "Materials declarations and restricted-chemistry screens for assemblies and parts.",
            description:
              "<p>A materials dossier for OEMs and suppliers who must know what is in the polymer, the solder, and the finish before a shipment leaves the dock.</p>",
            image: "/images/labs/electronics.jpg",
            sortOrder: 0,
          },
          {
            name: "Materials & Reliability Assay",
            slug: "electronics-materials-reliability",
            excerpt: "Identification, cleanliness, and failure-adjacent materials work.",
            description:
              "<p>When a part misbehaves, we start with what it is made of — and whether the factory sent what the drawing promised.</p>",
            image: "/images/labs/instruments.jpg",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const pharma = await prisma.category.create({
    data: {
      name: "Pharmaceuticals",
      slug: "pharmaceuticals",
      excerpt: "Identity, purity, and methodical release testing for medicines and actives.",
      description: `<p>A medicine is a promise measured in milligrams. Metrra’s pharmaceutical rooms are written for identity, assay, impurities, and the documentary manners that a quality system expects.</p>`,
      image: "/images/labs/precision.jpg",
      accent: "jade",
      sortOrder: 3,
      services: {
        create: [
          {
            name: "Identity, Assay & Impurities",
            slug: "pharma-identity-assay",
            excerpt: "Compendial and client methods for actives, excipients, and finished dose.",
            description:
              "<p>Chromatography and spectroscopy in the service of a batch that must be exactly what the dossier says it is.</p>",
            image: "/images/labs/assay.jpg",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const environment = await prisma.category.create({
    data: {
      name: "Environment & Water",
      slug: "environment-water",
      excerpt: "Air, effluent, and potable water — the rooms a factory cannot hide.",
      description: `<p>The factory has a second body: the water it takes, the air it returns, the soil it sits on. Metrra writes those rooms into numbers a regulator can read.</p>`,
      image: "/images/labs/chemistry.jpg",
      accent: "aqua",
      sortOrder: 4,
      services: {
        create: [
          {
            name: "Water Quality Protocol",
            slug: "water-quality-protocol",
            excerpt: "Potable, process, and effluent chemistry with a clean chain of custody.",
            description:
              "<p>From drinking water to discharge, we hold the chemistry to the standard the permit actually names.</p>",
            image: "/images/labs/chemistry.jpg",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.page.deleteMany();
  const home = await prisma.page.create({
    data: {
      title: "Metrra Lab Lab — Be Testing Be Unstoppable",
      slug: "home",
      kind: "home",
      excerpt: "A Noida house of analytical testing with European finish.",
      content: `<p>Metrra Lab stands in the institutional grain of Sector 62, Noida — a laboratory that treats measurement as a form of manners. We are built for brands that export, for factories that cannot bluff a regulator, and for product teams who want a number they can stand beside.</p><p>Food. Cosmetics. Electronics. And every discipline you add to the house. The Conservatory lets the laboratory grow without asking a developer for a new corridor.</p>`,
    },
  });

  const about = await prisma.page.create({
    data: {
      title: "The House",
      slug: "about",
      kind: "about",
      excerpt: "A legacy laboratory written in a European key.",
      content: `<p>Metrra Lab was raised as a private analytical house: not a marketplace of tests, but an atelier of protocols. Our rooms sit in A Block, Sector 62 Institutional Area — the scientific spine of Noida — and our manners are older than the corridor.</p><h2>What we believe</h2><p>A result is not a PDF. It is a sentence a quality director can say aloud. We write methods, keep instruments in a climate that flatters them, and refuse the theatre of rush when the chemistry is not ready.</p><h2>How the house is kept</h2><p>Scientists with long hands. Rooms at the right humidity. A workflow from commission to dossier that a client can follow without calling twice. The Conservatory — our editorial backstage — lets the house add a new discipline, a new banner, a new address, without breaking the public face.</p><h2>The mark</h2><p>The Double R is the house monogram: measured twice. Navy is the field. White is the highlight. The logo can be replaced from The Conservatory as a PNG or WebP the hour a new seal is drawn.</p>`,
    },
  });

  const accreditations = await prisma.page.create({
    data: {
      title: "Seals & Recognitions",
      slug: "accreditations",
      kind: "accreditations",
      excerpt: "The papers a serious laboratory keeps on the wall — and in the drawer.",
      content: `<p>Metrra is composed to international laboratory practice. The public seals below are the house’s current ledger; the Conservatory can revise them the hour a new recognition arrives.</p><h3>Working alignment</h3><ul><li>ISO/IEC 17025 laboratory competence</li><li>Food-system recognition for sampling and analysis</li><li>Pharmaceutical and cosmetic safety manners</li><li>Environmental monitoring protocols</li></ul><p>Ask the Conservatory to publish certificate files, scope PDFs, and the exact wording legal prefers.</p>`,
    },
  });

  await prisma.insight.deleteMany();
  const insight = await prisma.insight.create({
    data: {
      title: "A protocol is a piece of architecture",
      slug: "protocol-is-architecture",
      excerpt: "Why Metrra writes methods the way a conservator writes a condition report.",
      content: `<p>Most laboratories sell a turnaround. Metrra sells a room you can think in. A protocol names the sample, the instrument, the uncertainty, and the sentence the client will eventually need. That is architecture, not logistics.</p><p>When we add a category — food, cosmetic, electronics, or whatever the market invents next — we do not bolt on a brochure. We open a new wing of the house: methods, images, SEO, a lead door on every landing.</p>`,
      image: "/images/labs/instruments.jpg",
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      {
        question: "What does Metrra actually test?",
        answer:
          "Food, cosmetics, electronics, pharmaceuticals, water, and any discipline you commission. New categories can be opened from The Conservatory without rebuilding the site.",
        sortOrder: 0,
      },
      {
        question: "Where is the laboratory?",
        answer:
          "A Block, Sector 62 Institutional Area, Noida, Uttar Pradesh, India 201301. Correspondence: contact@metrra.com.",
        sortOrder: 1,
      },
      {
        question: "How do I request a protocol?",
        answer:
          "Every public page carries a lead folio. Tell us the product, the market, and the standard you must satisfy. We reply from contact@metrra.com.",
        sortOrder: 2,
      },
      {
        question: "Can the address and contact details change later?",
        answer:
          "Yes. The Conservatory House panel updates address, telephone, hours, map, and email across the site the moment you save.",
        sortOrder: 3,
      },
      {
        question: "Do you help with SEO for service pages?",
        answer:
          "The Compass inside The Conservatory scores titles, descriptions, Open Graph, canonicals, and focus keywords. Every page can be edited to current SEO practice.",
        sortOrder: 4,
      },
    ],
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "They write a protocol the way a conservator writes a condition report. We ship on that number.",
        name: "Kavya Menon",
        role: "Quality Director",
        company: "Aureum Nutrition",
        sortOrder: 0,
        published: true,
      },
      {
        quote: "Metrra Lab treated our emulsion as a contract with the face. The stability dossier survived three retailers.",
        name: "Luca Ferrante",
        role: "Founder",
        company: "Atelier Solenne",
        sortOrder: 1,
        published: true,
      },
      {
        quote: "Restricted-substance work without the theatre. The materials declaration arrived before the shipment did.",
        name: "Rohit Bhandari",
        role: "Sourcing Lead",
        company: "North Arc Electronics",
        sortOrder: 2,
        published: true,
      },
      {
        quote: "The Conservatory let us open a new category without waiting on a brochure house. The public page was live the same afternoon.",
        name: "Anika Shah",
        role: "Regulatory Counsel",
        company: "Veda Formulations",
        sortOrder: 3,
        published: true,
      },
    ],
  });

  await prisma.seoRecord.deleteMany();
  const seos = [
    {
      path: "/",
      title: "Metrra Lab Lab | Analytical Testing Laboratory in Noida",
      description:
        "Metrra Lab is a high-house of analytical testing in Sector 62, Noida. Food, cosmetics, electronics, and custom disciplines. Be testing. Be unstoppable.",
      keywords: "testing laboratory Noida, food testing, cosmetic testing, electronics testing, Metrra",
      focusKeyword: "analytical testing laboratory",
      ogImage: "/images/labs/hero-3.jpg",
      canonical: "https://www.metrra.com/",
      pageId: home.id,
    },
    {
      path: "/about",
      title: "The House | Metrra Laboratory Noida",
      description:
        "Meet the Metrra house: a European-mannered testing laboratory in A Block, Sector 62 Institutional Area, Noida. Legacy, instruments, and unstoppable protocols.",
      keywords: "Metrra about, testing lab Noida, Sector 62 laboratory",
      focusKeyword: "testing laboratory Noida",
      ogImage: "/images/labs/discipline.jpg",
      canonical: "https://www.metrra.com/about",
      pageId: about.id,
    },
    {
      path: "/accreditations",
      title: "Seals & Recognitions | Metrra Lab",
      description:
        "ISO/IEC 17025 alignment and the recognitions Metrra keeps for food, cosmetic, pharmaceutical, and environmental work. Updated from The Conservatory.",
      keywords: "ISO 17025, laboratory accreditation, Metrra seals",
      focusKeyword: "laboratory accreditation",
      ogImage: "/images/labs/instruments.jpg",
      canonical: "https://www.metrra.com/accreditations",
      pageId: accreditations.id,
    },
    {
      path: "/disciplines/food-nutrition",
      title: "Food Testing Laboratory | Metrra Noida",
      description:
        "Food and nutrition assays at Metrra: residues, metals, mycotoxins, nutrition labels, and fortification recovery for Indian and export brands.",
      keywords: "food testing laboratory, nutrition assay, residue testing Noida",
      focusKeyword: "food testing laboratory",
      ogImage: "/images/labs/food.jpg",
      categoryId: food.id,
    },
    {
      path: "/disciplines/cosmetics-personal-care",
      title: "Cosmetic Testing Laboratory | Metrra Lab",
      description:
        "Cosmetic and personal-care testing in Noida: restricted substances, microbiology, stability, and claim support for formulas that sit on skin.",
      keywords: "cosmetic testing, personal care laboratory, stability testing",
      focusKeyword: "cosmetic testing",
      ogImage: "/images/labs/cosmetics.jpg",
      categoryId: cosmetics.id,
    },
    {
      path: "/disciplines/electronics-electrical",
      title: "Electronics Testing | Metrra Laboratory",
      description:
        "Electronics and electrical materials testing: restricted substances, polymer identification, cleanliness, and incoming inspection for assemblies.",
      keywords: "electronics testing, restricted substances, materials assay",
      focusKeyword: "electronics testing",
      ogImage: "/images/labs/electronics.jpg",
      categoryId: electronics.id,
    },
    {
      path: "/disciplines/pharmaceuticals",
      title: "Pharmaceutical Testing | Metrra Lab",
      description:
        "Pharmaceutical identity, assay, and impurity work at Metrra’s Noida house — written for quality systems that expect a defendable number.",
      keywords: "pharmaceutical testing, assay, impurities laboratory",
      focusKeyword: "pharmaceutical testing",
      ogImage: "/images/labs/precision.jpg",
      categoryId: pharma.id,
    },
    {
      path: "/disciplines/environment-water",
      title: "Water & Environment Testing | Metrra Lab",
      description:
        "Water quality and environmental monitoring protocols from Metrra, Sector 62 Noida — potable, process, and effluent chemistry with chain of custody.",
      keywords: "water testing Noida, effluent, environmental laboratory",
      focusKeyword: "water testing",
      ogImage: "/images/labs/chemistry.jpg",
      categoryId: environment.id,
    },
    {
      path: "/insights/protocol-is-architecture",
      title: "A Protocol is Architecture | Metrra Insights",
      description:
        "Why Metrra writes laboratory methods like architecture — and how new testing categories open as wings of the house, not brochures.",
      keywords: "laboratory protocol, testing methods, Metrra insights",
      focusKeyword: "laboratory protocol",
      ogImage: "/images/labs/instruments.jpg",
      insightId: insight.id,
    },
    {
      path: "/contact",
      title: "Commission a Protocol | Contact Metrra",
      description:
        "Write to Metrra at contact@metrra.com or visit A Block, Sector 62 Institutional Area, Noida 201301. Every page can capture a lead.",
      keywords: "contact Metrra, testing lab Noida address, request quote",
      focusKeyword: "contact Metrra",
      ogImage: "/images/labs/hero-2.jpg",
      canonical: "https://www.metrra.com/contact",
    },
    {
      path: "/disciplines",
      title: "Testing Disciplines | Metrra Lab",
      description:
        "Browse Metrra’s testing disciplines — food, cosmetics, electronics, pharmaceuticals, water — or ask The Conservatory to open a new category.",
      keywords: "testing categories, food cosmetics electronics laboratory",
      focusKeyword: "testing disciplines",
      ogImage: "/images/labs/discipline.jpg",
      canonical: "https://www.metrra.com/disciplines",
    },
  ];

  for (const seo of seos) {
    await prisma.seoRecord.create({
      data: {
        ...seo,
        ogTitle: seo.title,
        ogDescription: seo.description,
        robots: "index,follow",
        canonical: seo.canonical || `https://www.metrra.com${seo.path}`,
      },
    });
  }

  await prisma.mediaAsset.deleteMany();
  await prisma.mediaAsset.createMany({
    data: [
      { filename: "hero-1.jpg", url: "/images/labs/hero-1.jpg", alt: "Scientist at the microscope", mimeType: "image/jpeg", size: 782070 },
      { filename: "hero-2.jpg", url: "/images/labs/hero-2.jpg", alt: "Assay glassware", mimeType: "image/jpeg", size: 281406 },
      { filename: "hero-3.jpg", url: "/images/labs/hero-3.jpg", alt: "Laboratory bench", mimeType: "image/jpeg", size: 405860 },
      { filename: "food.jpg", url: "/images/labs/food.jpg", alt: "Food discipline", mimeType: "image/jpeg", size: 523144 },
      { filename: "cosmetics.jpg", url: "/images/labs/cosmetics.jpg", alt: "Cosmetic discipline", mimeType: "image/jpeg", size: 361385 },
      { filename: "electronics.jpg", url: "/images/labs/electronics.jpg", alt: "Electronics discipline", mimeType: "image/jpeg", size: 300736 },
    ],
  });

  console.log("Metrra Lab house seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
