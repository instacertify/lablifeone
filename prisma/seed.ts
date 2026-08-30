import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type TestSeed = {
  name: string;
  slug: string;
  excerpt: string;
  description: string;
  standard: string;
  timeline: string;
  method: string;
  sample: string;
  notes?: string;
  image?: string;
  sortOrder?: number;
};

function test(data: TestSeed) {
  return {
    ...data,
    published: true,
    sortOrder: data.sortOrder ?? 0,
  };
}

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
      "Metrra Lab is a global laboratory with global solutions — food, cosmetics, electronics, metals, polymers, and every discipline you commission next.",
    footerNote:
      "A global laboratory with global solutions. Protocols written for industries that cannot afford doubt.",
    logoUrl: "/images/metrra-lab-logo.png",
    identityLine: "A global laboratory with global solutions",
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
        subtitle: "A global laboratory with global solutions.",
        image: "/images/labs/hero-1.jpg",
        ctaLabel: "Request a quote",
        ctaHref: "/contact",
        sortOrder: 0,
        active: true,
      },
      {
        title: "Be testing. Be unstoppable.",
        subtitle: "Food, cosmetics, electronics, metals, polymers — all under Disciplines.",
        image: "/images/labs/hero-2.jpg",
        ctaLabel: "Explore disciplines",
        ctaHref: "/disciplines",
        sortOrder: 1,
        active: true,
      },
      {
        title: "Be testing. Be unstoppable.",
        subtitle: "Standards, timelines, and dossiers written for the market you ship to.",
        image: "/images/labs/hero-3.jpg",
        ctaLabel: "Request a quote",
        ctaHref: "/contact",
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
      description:
        "<p>Metrra’s food atelier reads a product the way a sommelier reads a vintage — origin, integrity, and what must never be present. Residues, nutrition, and microbiology sit as subcategories under this discipline, each with tests the Conservatory can extend.</p>",
      image: "/images/labs/food.jpg",
      accent: "aqua",
      sortOrder: 0,
      services: {
        create: [
          test({
            name: "Food Discipline Intake",
            slug: "food-discipline-intake",
            excerpt: "A scoped brief that names the product, market, and the standard that must be satisfied.",
            description: "<p>Commission the food wing with a product, a destination market, and the standard the dossier must name.</p>",
            standard: "Client protocol / FSSAI",
            timeline: "1–2 working days to protocol",
            method: "Desk review + method selection",
            sample: "Product specification and label artwork",
            image: "/images/labs/food.jpg",
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Residues & Contaminants",
      slug: "food-residues",
      excerpt: "Pesticides, metals, and mycotoxins for domestic and export release.",
      description: "<p>Multi-residue and contaminant work written so a quality lead can defend the number.</p>",
      image: "/images/labs/food.jpg",
      accent: "aqua",
      sortOrder: 0,
      parentId: food.id,
      services: {
        create: [
          test({
            name: "Pesticide Multi-Residue Screen",
            slug: "food-pesticide-multi-residue",
            excerpt: "Multi-residue pesticide profiles for export and domestic release.",
            description: "<p>LC-MS/MS multi-residue work aligned to the residue definition the market actually uses.</p>",
            standard: "FSSAI / SANTE 11312/2021",
            timeline: "5–7 working days",
            method: "LC-MS/MS",
            sample: "250 g edible portion",
            notes: "Export-ready residue dossier",
            image: "/images/labs/assay.jpg",
          }),
          test({
            name: "Heavy Metals in Food",
            slug: "food-heavy-metals",
            excerpt: "Lead, cadmium, mercury, and arsenic for pack and export release.",
            description: "<p>Trace metals quantified against the limit the destination market names.</p>",
            standard: "AOAC / FSSAI",
            timeline: "4–6 working days",
            method: "ICP-MS",
            sample: "100 g homogenised",
            image: "/images/labs/chemistry.jpg",
            sortOrder: 1,
          }),
          test({
            name: "Mycotoxin Profile",
            slug: "food-mycotoxins",
            excerpt: "Aflatoxins, ochratoxin, and DON for grains, spices, and nuts.",
            description: "<p>A mycotoxin folio written for the commodity and the buyer’s specification.</p>",
            standard: "ISO 16050 / FSSAI",
            timeline: "4–5 working days",
            method: "HPLC / LC-MS/MS",
            sample: "200 g representative lot",
            image: "/images/labs/assay.jpg",
            sortOrder: 2,
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Nutrition & Labelling",
      slug: "food-nutrition-labelling",
      excerpt: "Nutrition facts and fortification recovery for the pack.",
      description: "<p>What the pack claims, recovered with the patience a label audit deserves.</p>",
      image: "/images/labs/food.jpg",
      accent: "aqua",
      sortOrder: 1,
      parentId: food.id,
      services: {
        create: [
          test({
            name: "Nutrition Facts Panel",
            slug: "nutrition-facts-panel",
            excerpt: "Label-ready energy, protein, fat, carbohydrate, and sugars.",
            description: "<p>A nutrition panel written for the regulation the pack will meet.</p>",
            standard: "FSSAI / Codex CAC/GL 2",
            timeline: "5–8 working days",
            method: "AOAC suite",
            sample: "300 g finished product",
            image: "/images/labs/chemistry.jpg",
          }),
          test({
            name: "Fortification Recovery",
            slug: "nutrition-fortification",
            excerpt: "Vitamin and mineral recovery for fortified foods.",
            description: "<p>We recover what the fortification claim promises.</p>",
            standard: "FSSAI Fortification / AOAC",
            timeline: "7–10 working days",
            method: "HPLC / ICP-OES",
            sample: "250 g + retained pack",
            image: "/images/labs/chemistry.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  const cosmetics = await prisma.category.create({
    data: {
      name: "Cosmetics & Personal Care",
      slug: "cosmetics-personal-care",
      excerpt: "Safety, stability, and claim support for formulas that sit on skin.",
      description:
        "<p>A cosmetic is a contract with the face. Restricted substances, microbiology, and stability sit as subcategories — each test carrying a standard and a timeline the Conservatory can edit.</p>",
      image: "/images/labs/cosmetics.jpg",
      accent: "iris",
      sortOrder: 1,
    },
  });

  await prisma.category.create({
    data: {
      name: "Safety & Restricted Lists",
      slug: "cosmetic-safety",
      excerpt: "Restricted substances, metals, and microbial limits.",
      description: "<p>Map the formula against the lists a retailer or regulator will actually open.</p>",
      image: "/images/labs/cosmetics.jpg",
      accent: "iris",
      sortOrder: 0,
      parentId: cosmetics.id,
      services: {
        create: [
          test({
            name: "Cosmetic Restricted Substances",
            slug: "cosmetic-restricted-substances",
            excerpt: "Restricted lists and heavy metals for leave-on and rinse-off formulas.",
            description: "<p>From lipstick to lotion, a restricted-substance screen a brand can ship with.</p>",
            standard: "IS 4707 / EU 1223/2009 Annexes",
            timeline: "6–8 working days",
            method: "GC-MS / ICP-MS",
            sample: "50 g finished formula",
            image: "/images/labs/cosmetics.jpg",
          }),
          test({
            name: "Cosmetic Microbiology",
            slug: "cosmetic-microbiology",
            excerpt: "Microbial limits and preservative efficacy.",
            description: "<p>Counts and challenge tests written for the pack and the climate it will live in.</p>",
            standard: "ISO 17516 / ISO 11930",
            timeline: "7–28 days by protocol",
            method: "Plate count / PET",
            sample: "100 g unopened units",
            notes: "PET timeline follows the challenge schedule",
            image: "/images/labs/cosmetics.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Stability & Claim Support",
      slug: "cosmetic-stability-claims",
      excerpt: "Accelerated stability, packaging interaction, and claim evidence.",
      description: "<p>Age the formula, watch the pack, write the evidence a claim actually needs.</p>",
      image: "/images/labs/precision.jpg",
      accent: "iris",
      sortOrder: 1,
      parentId: cosmetics.id,
      services: {
        create: [
          test({
            name: "Accelerated Stability",
            slug: "cosmetic-accelerated-stability",
            excerpt: "Accelerated and real-time stability for emulsions and serums.",
            description: "<p>A stability folio that names temperature, humidity, and what changed.</p>",
            standard: "ICH Q1A adapted / ISO 18811",
            timeline: "4–12 weeks by protocol",
            method: "Climate chamber + chemistry",
            sample: "12 finished packs",
            image: "/images/labs/precision.jpg",
          }),
        ],
      },
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics & Electrical",
      slug: "electronics-electrical",
      excerpt: "Materials, restricted substances, and reliability for objects that carry current.",
      description:
        "<p>Electronics fail quietly until they do not. Restricted chemistry and materials reliability live as subcategories under this discipline — never as a separate site heading.</p>",
      image: "/images/labs/electronics.jpg",
      accent: "bronze",
      sortOrder: 2,
    },
  });

  await prisma.category.create({
    data: {
      name: "Restricted Substances",
      slug: "electronics-restricted",
      excerpt: "Materials declarations and restricted-chemistry screens.",
      description: "<p>Know what is in the polymer, the solder, and the finish before a shipment leaves.</p>",
      image: "/images/labs/electronics.jpg",
      accent: "bronze",
      sortOrder: 0,
      parentId: electronics.id,
      services: {
        create: [
          test({
            name: "RoHS Restricted Screen",
            slug: "electronics-rohs",
            excerpt: "Restricted-substance screen for assemblies and parts.",
            description: "<p>A materials dossier for OEMs who must name the chemistry before the dock.</p>",
            standard: "IEC 62321 / RoHS",
            timeline: "5–8 working days",
            method: "XRF + wet chemistry",
            sample: "Homogeneous material or part",
            image: "/images/labs/electronics.jpg",
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Materials & Reliability",
      slug: "electronics-materials",
      excerpt: "Identification, cleanliness, and failure-adjacent materials work.",
      description: "<p>When a part misbehaves, we start with what it is made of.</p>",
      image: "/images/labs/instruments.jpg",
      accent: "bronze",
      sortOrder: 1,
      parentId: electronics.id,
      services: {
        create: [
          test({
            name: "Polymer & Coating Identification",
            slug: "electronics-polymer-id",
            excerpt: "Identification of polymers, coatings, and finishes on assemblies.",
            description: "<p>FTIR and microscopy in the service of a drawing that must match the part.</p>",
            standard: "ASTM E1252 / ISO 11358",
            timeline: "3–5 working days",
            method: "FTIR / DSC",
            sample: "5 g or one representative part",
            image: "/images/labs/instruments.jpg",
          }),
        ],
      },
    },
  });

  const metals = await prisma.category.create({
    data: {
      name: "Metals & Alloy",
      slug: "metals-alloy",
      excerpt: "Composition, grade confirmation, and corrosion manners for metals that must be exactly what the drawing says.",
      description:
        "<p>A metal is a promise of grade. Composition, mechanical behaviour, and corrosion sit as subcategories under Disciplines — generated and edited from the Conservatory, never as a separate top heading.</p>",
      image: "/images/labs/instruments.jpg",
      accent: "bronze",
      sortOrder: 3,
    },
  });

  await prisma.category.create({
    data: {
      name: "Composition & Grade",
      slug: "metals-composition",
      excerpt: "Alloy chemistry and grade confirmation.",
      description: "<p>Name the alloy the mill claimed and the one that arrived.</p>",
      image: "/images/labs/instruments.jpg",
      accent: "bronze",
      sortOrder: 0,
      parentId: metals.id,
      services: {
        create: [
          test({
            name: "Alloy Chemistry (OES / ICP)",
            slug: "metals-alloy-chemistry",
            excerpt: "Grade confirmation for steels, aluminium, and copper alloys.",
            description: "<p>Composition written against the specification the purchase order actually names.</p>",
            standard: "ASTM E415 / IS 228",
            timeline: "3–5 working days",
            method: "OES / ICP-OES",
            sample: "50 mm coupon or turnings",
            image: "/images/labs/instruments.jpg",
          }),
          test({
            name: "Inclusion & Cleanliness Rating",
            slug: "metals-inclusion-rating",
            excerpt: "Non-metallic inclusion rating for critical steels.",
            description: "<p>A cleanliness number a forging house can stand beside.</p>",
            standard: "ASTM E45 / ISO 4967",
            timeline: "4–6 working days",
            method: "Optical metallography",
            sample: "Prepared coupon",
            image: "/images/labs/precision.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Mechanical & Corrosion",
      slug: "metals-mechanical-corrosion",
      excerpt: "Tensile, hardness, and corrosion behaviour.",
      description: "<p>How the metal behaves when asked to work, and when asked to wait in weather.</p>",
      image: "/images/labs/precision.jpg",
      accent: "bronze",
      sortOrder: 1,
      parentId: metals.id,
      services: {
        create: [
          test({
            name: "Tensile & Hardness",
            slug: "metals-tensile-hardness",
            excerpt: "Tensile strength, elongation, and hardness for mill and incoming inspection.",
            description: "<p>Mechanical numbers written to the geometry the standard allows.</p>",
            standard: "ASTM E8 / ISO 6892-1",
            timeline: "4–7 working days",
            method: "Universal testing machine",
            sample: "Machined tensile bar",
            image: "/images/labs/precision.jpg",
          }),
          test({
            name: "Salt Spray Corrosion",
            slug: "metals-salt-spray",
            excerpt: "Neutral salt spray for coatings and plated parts.",
            description: "<p>Hours to first red rust, written without theatre.</p>",
            standard: "ASTM B117 / ISO 9227",
            timeline: "48–1000 hours by protocol",
            method: "Neutral salt spray",
            sample: "Finished parts",
            notes: "Timeline follows the hours the specification names",
            image: "/images/labs/instruments.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  const plastics = await prisma.category.create({
    data: {
      name: "Plastics & Polymer",
      slug: "plastics-polymer",
      excerpt: "Identification, properties, and product-safety work for polymers that hold food, skin, or current.",
      description:
        "<p>A polymer is a recipe and a risk. Identification and migration sit as subcategories under this discipline. Tests, standards, and timelines are generated from the Conservatory.</p>",
      image: "/images/labs/chemistry.jpg",
      accent: "jade",
      sortOrder: 4,
    },
  });

  await prisma.category.create({
    data: {
      name: "Identification & Properties",
      slug: "plastics-identification",
      excerpt: "Resin identification, melt flow, and thermal behaviour.",
      description: "<p>Name the resin and the manners it will keep under heat.</p>",
      image: "/images/labs/chemistry.jpg",
      accent: "jade",
      sortOrder: 0,
      parentId: plastics.id,
      services: {
        create: [
          test({
            name: "Polymer Identification (FTIR / DSC)",
            slug: "plastics-ftir-dsc",
            excerpt: "Resin family and thermal transitions for incoming lots.",
            description: "<p>FTIR and DSC to confirm the resin the drawing promised.</p>",
            standard: "ASTM D3418 / ISO 11357",
            timeline: "3–5 working days",
            method: "FTIR / DSC",
            sample: "10 g pellets or part cuttings",
            image: "/images/labs/chemistry.jpg",
          }),
          test({
            name: "Melt Flow Rate",
            slug: "plastics-melt-flow",
            excerpt: "Melt flow for processing and grade confirmation.",
            description: "<p>A flow number a moulder can set a machine by.</p>",
            standard: "ASTM D1238 / ISO 1133",
            timeline: "2–4 working days",
            method: "Melt flow indexer",
            sample: "50 g dry pellets",
            image: "/images/labs/chemistry.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Migration & Product Safety",
      slug: "plastics-migration",
      excerpt: "Overall and specific migration for food-contact and consumer goods.",
      description: "<p>What leaves the polymer when it meets food, sweat, or solvent.</p>",
      image: "/images/labs/assay.jpg",
      accent: "jade",
      sortOrder: 1,
      parentId: plastics.id,
      services: {
        create: [
          test({
            name: "Overall Migration",
            slug: "plastics-overall-migration",
            excerpt: "Overall migration for food-contact articles.",
            description: "<p>Simulants and times the regulation names, not the ones a brochure prefers.</p>",
            standard: "EU 10/2011 / IS 9845",
            timeline: "7–12 working days",
            method: "Gravimetric migration",
            sample: "Finished article or 2 dm²",
            image: "/images/labs/assay.jpg",
          }),
          test({
            name: "Specific Migration of Metals",
            slug: "plastics-specific-migration-metals",
            excerpt: "Specific migration of metals from food-contact polymers.",
            description: "<p>Metals that must not leave the pack for the food.</p>",
            standard: "EU 10/2011 Annex II",
            timeline: "8–12 working days",
            method: "ICP-MS after migration",
            sample: "Finished article",
            image: "/images/labs/assay.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  const pharma = await prisma.category.create({
    data: {
      name: "Pharmaceuticals",
      slug: "pharmaceuticals",
      excerpt: "Identity, purity, and methodical release testing for medicines and actives.",
      description:
        "<p>A medicine is a promise measured in milligrams. Identity, assay, and impurities live here as tests the Conservatory can extend.</p>",
      image: "/images/labs/precision.jpg",
      accent: "jade",
      sortOrder: 5,
      services: {
        create: [
          test({
            name: "Identity, Assay & Impurities",
            slug: "pharma-identity-assay",
            excerpt: "Compendial and client methods for actives, excipients, and finished dose.",
            description: "<p>Chromatography and spectroscopy in the service of a batch that must be exactly what the dossier says.</p>",
            standard: "IP / USP / Ph. Eur.",
            timeline: "5–10 working days",
            method: "HPLC / UV / IR",
            sample: "As per monograph",
            image: "/images/labs/assay.jpg",
          }),
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Identity & Assay",
      slug: "pharma-identity-assay-wing",
      excerpt: "Compendial identity and assay work.",
      description: "<p>The monograph named, the instrument ready, the sentence written.</p>",
      image: "/images/labs/precision.jpg",
      accent: "jade",
      sortOrder: 0,
      parentId: pharma.id,
      services: {
        create: [
          test({
            name: "Related Substances",
            slug: "pharma-related-substances",
            excerpt: "Impurity profiles for actives and finished dose.",
            description: "<p>Related substances against the monograph or the client method.</p>",
            standard: "ICH Q3B / USP",
            timeline: "6–10 working days",
            method: "HPLC",
            sample: "As per method",
            image: "/images/labs/assay.jpg",
          }),
        ],
      },
    },
  });

  const environment = await prisma.category.create({
    data: {
      name: "Environment & Water",
      slug: "environment-water",
      excerpt: "Air, effluent, and potable water — the rooms a factory cannot hide.",
      description:
        "<p>The factory has a second body: the water it takes and the air it returns. Tests here carry the standard the permit actually names.</p>",
      image: "/images/labs/chemistry.jpg",
      accent: "aqua",
      sortOrder: 6,
    },
  });

  await prisma.category.create({
    data: {
      name: "Water Quality",
      slug: "water-quality",
      excerpt: "Potable, process, and effluent chemistry.",
      description: "<p>Drinking water to discharge, held to the permit.</p>",
      image: "/images/labs/chemistry.jpg",
      accent: "aqua",
      sortOrder: 0,
      parentId: environment.id,
      services: {
        create: [
          test({
            name: "Potable Water Protocol",
            slug: "water-potable-protocol",
            excerpt: "Potable chemistry with a clean chain of custody.",
            description: "<p>IS 10500 parameters written so a facilities lead can post the result.</p>",
            standard: "IS 10500",
            timeline: "3–7 working days",
            method: "APHA / IS methods",
            sample: "2 L in laboratory bottles",
            image: "/images/labs/chemistry.jpg",
          }),
          test({
            name: "Effluent Discharge",
            slug: "water-effluent-discharge",
            excerpt: "Process and effluent chemistry against the consent.",
            description: "<p>The consent named, the chain of custody kept.</p>",
            standard: "CPCB / EPA methods",
            timeline: "5–8 working days",
            method: "APHA suite",
            sample: "Composite as specified",
            image: "/images/labs/chemistry.jpg",
            sortOrder: 1,
          }),
        ],
      },
    },
  });

  const allCategories = await prisma.category.findMany();

  await prisma.page.deleteMany();
  const home = await prisma.page.create({
    data: {
      title: "Metrra Lab — Be Testing Be Unstoppable",
      slug: "home",
      kind: "home",
      excerpt: "A global laboratory with global solutions.",
      content:
        "<p>Metrra Lab is a global laboratory with global solutions. We write protocols for brands that export, factories that cannot bluff a regulator, and product teams who want a number they can stand beside.</p><p>Food, cosmetics, electronics, metals, and polymers live as a submenu under Disciplines — never as separate headings. The Conservatory lets the laboratory add a category, a subcategory, or a test with its standard and timeline, without asking a developer for a new corridor. A facility address can be held on file. It is not the identity of the house.</p>",
    },
  });

  const about = await prisma.page.create({
    data: {
      title: "The House",
      slug: "about",
      kind: "about",
      excerpt: "A global laboratory with global solutions.",
      content:
        "<p>Metrra Lab is a global laboratory with global solutions. We write protocols for food, cosmetics, electronics, metals, polymers, and any discipline you commission next.</p><h2>What we believe</h2><p>A result is not a PDF. It is a sentence a quality director can say aloud. We write methods, keep instruments in a climate that flatters them, and refuse the theatre of rush when the chemistry is not ready.</p><h2>Identity and facility</h2><p>The house is global. A laboratory facility may sit at an address the Conservatory holds — today that file lists A Block, Sector 62 Institutional Area. That address is a door, not the brand. Identity, tagline, and contact stay editable from The Conservatory.</p><h2>How the house is kept</h2><p>Every discipline lives under one public menu. Each wing can hold many subcategories and many tests. Each test carries a standard, a timeline, a method, a sample, and notes — all generated from the Conservatory, including bulk CSV upload.</p><h2>The mark</h2><p>The Double R is the house monogram: measured twice. Navy is the field. White is the highlight. The logo can be replaced from The Conservatory as a PNG or WebP.</p>",
    },
  });

  await prisma.insight.deleteMany();
  await prisma.industry.deleteMany();

  const [foodIndustry, cosmeticIndustry, plasticsIndustry, electronicsIndustry, metalsIndustry] =
    await Promise.all(
      [
        ["Food and Beverage Industry", "food-and-beverage-industry"],
        ["Cosmetic Industry", "cosmetic-industry"],
        ["Plastics Industry", "plastics-industry"],
        ["Electronics Industry", "electronics-industry"],
        ["Metals & Alloy Industry", "metals-alloy-industry"],
        ["Pharmaceutical Industry", "pharmaceutical-industry"],
        ["Environment & Water Industry", "environment-water-industry"],
      ].map(([name, slug], index) =>
        prisma.industry.create({
          data: { name, slug, sortOrder: index, published: true },
        }),
      ),
    );

  const insightNotes = [
    {
      title: "A protocol is a piece of architecture",
      slug: "protocol-is-architecture",
      excerpt: "Why Metrra writes methods the way a conservator writes a condition report.",
      content:
        "<p>Most laboratories sell a turnaround. Metrra sells a room you can think in. A protocol names the sample, the instrument, the uncertainty, and the sentence the client will eventually need. That is architecture, not logistics.</p><p>When we add a category — food, cosmetic, electronics, metals, polymer, or whatever the market invents next — we do not bolt on a brochure. We open a wing under Disciplines: methods, standards, timelines, images, SEO, a lead door on every landing.</p>",
      image: "/images/labs/food.jpg",
      industryId: foodIndustry.id,
    },
    {
      title: "What a nutrition panel must actually prove",
      slug: "nutrition-panel-must-prove",
      excerpt: "Label claims in food and beverage only survive if the assay names the same standard the retailer will open.",
      content:
        "<p>A nutrition panel is a contract with a buyer. Energy, protein, sugars, and fortificants have to recover against the regulation the pack will meet — not the one a brochure prefers.</p>",
      image: "/images/labs/food.jpg",
      industryId: foodIndustry.id,
    },
    {
      title: "Restricted lists before the face meets the formula",
      slug: "cosmetic-restricted-lists",
      excerpt: "Cosmetic Industry notes on restricted substances, microbiology, and the evidence a claim actually needs.",
      content:
        "<p>A cosmetic is a contract with the face. Restricted lists, microbial limits, and stability are not a brochure — they are the sentences a retailer will ask for.</p>",
      image: "/images/labs/cosmetics.jpg",
      industryId: cosmeticIndustry.id,
    },
    {
      title: "What leaves the polymer when it meets food",
      slug: "polymer-migration-food-contact",
      excerpt: "Plastics Industry notes on overall and specific migration for food-contact articles.",
      content:
        "<p>A polymer is a recipe and a risk. Overall migration and metal migration are written to the simulant and time the regulation names.</p>",
      image: "/images/labs/chemistry.jpg",
      industryId: plasticsIndustry.id,
    },
    {
      title: "Materials declarations before the shipment leaves",
      slug: "electronics-materials-declarations",
      excerpt: "Electronics Industry notes on restricted chemistry and the dossier an OEM can stand beside.",
      content:
        "<p>Electronics fail quietly until they do not. Restricted-substance screens and polymer identification belong in the same folio as the drawing.</p>",
      image: "/images/labs/electronics.jpg",
      industryId: electronicsIndustry.id,
    },
    {
      title: "Grade confirmation is a promise of chemistry",
      slug: "metals-grade-confirmation",
      excerpt: "Metals & Alloy Industry notes on composition, tensile work, and salt spray without theatre.",
      content:
        "<p>A metal is a promise of grade. Composition, hardness, and corrosion hours should be written against the specification the purchase order actually names.</p>",
      image: "/images/labs/instruments.jpg",
      industryId: metalsIndustry.id,
    },
  ];

  const createdInsights = [];
  for (const note of insightNotes) {
    createdInsights.push(
      await prisma.insight.create({
        data: {
          ...note,
          published: true,
          publishedAt: new Date(),
        },
      }),
    );
  }

  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      {
        question: "What does Metrra actually test?",
        answer:
          "Food, cosmetics, electronics, metals, polymers, pharmaceuticals, water, and any discipline you commission. They all live under Disciplines. New categories, subcategories, and tests — each with a standard and timeline — can be opened from The Conservatory, including bulk CSV upload.",
        sortOrder: 0,
      },
      {
        question: "Is the Sector 62 laboratory the brand?",
        answer:
          "No. Metrra Lab is a global laboratory with global solutions. A facility address can be held in The Conservatory for visits and correspondence. It is not the identity of the house.",
        sortOrder: 1,
      },
      {
        question: "How do I request a quote?",
        answer:
          "Every public page has a Request a quote form. Tell us the product, the market, and the standard you must satisfy. We reply from contact@metrra.com.",
        sortOrder: 2,
      },
      {
        question: "Can identity, address, and tests change later?",
        answer:
          "Yes. The Conservatory House panel updates identity line, address, hours, map, and email. The Atelier adds categories, subcategories, and tests with standards and timelines — one at a time or by bulk upload.",
        sortOrder: 3,
      },
      {
        question: "Where are industry notes published?",
        answer:
          "Industry Insights — the public menu next to Disciplines — lists notes filtered by Cosmetic Industry, Food and Beverage, Plastics, and any vertical you open from The Conservatory Folio.",
        sortOrder: 4,
      },
      {
        question: "Do you help with SEO for service pages?",
        answer:
          "The Compass inside The Conservatory scores titles, descriptions, Open Graph, canonicals, and focus keywords. Every page can be edited to current SEO practice.",
        sortOrder: 5,
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
        quote: "The Conservatory let us open metals and polymers under Disciplines the same afternoon — standards and timelines included.",
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
      title: "Metrra Lab | A global laboratory with global solutions",
      description:
        "Metrra Lab is a global laboratory with global solutions. Food, cosmetics, electronics, metals, polymers, and custom disciplines. Be testing. Be unstoppable.",
      keywords: "global laboratory, food testing, cosmetic testing, electronics testing, metals testing, polymer testing, Metrra",
      focusKeyword: "global laboratory",
      ogImage: "/images/labs/hero-3.jpg",
      canonical: "https://www.metrra.com/",
      pageId: home.id,
    },
    {
      path: "/about",
      title: "The House | Metrra Lab",
      description:
        "Meet Metrra Lab: a global laboratory with global solutions. Food, cosmetics, electronics, metals, polymers, and the disciplines you commission next.",
      keywords: "Metrra about, global laboratory, testing laboratory",
      focusKeyword: "global laboratory",
      ogImage: "/images/labs/discipline.jpg",
      canonical: "https://www.metrra.com/about",
      pageId: about.id,
    },
    {
      path: "/insights",
      title: "Industry Insights | Metrra Lab",
      description:
        "Industry notes from Metrra Lab — cosmetics, food and beverage, plastics, electronics, metals, and the verticals you open next.",
      keywords: "industry insights, cosmetic industry, food and beverage, plastics industry, Metrra",
      focusKeyword: "industry insights",
      ogImage: "/images/labs/instruments.jpg",
      canonical: "https://www.metrra.com/insights",
    },
    ...createdInsights.map((item) => ({
      path: `/insights/${item.slug}`,
      title: `${item.title} | Metrra Lab`,
      description: item.excerpt,
      keywords: "industry insights, Metrra Lab",
      focusKeyword: "industry insights",
      ogImage: item.image || "/images/labs/instruments.jpg",
      insightId: item.id,
    })),
    {
      path: "/contact",
      title: "Request a Quote | Contact Metrra Lab",
      description:
        "Write to Metrra Lab at contact@metrra.com. A global laboratory with global solutions. Request a quote from any page.",
      keywords: "contact Metrra Lab, request quote, global laboratory",
      focusKeyword: "request a quote",
      ogImage: "/images/labs/hero-2.jpg",
      canonical: "https://www.metrra.com/contact",
    },
    {
      path: "/disciplines",
      title: "Testing Disciplines | Metrra Lab",
      description:
        "Browse Metrra’s testing disciplines — food, cosmetics, electronics, metals, polymers — all under one menu, with subcategories and tests from the Conservatory.",
      keywords: "testing categories, food cosmetics electronics metals polymers laboratory",
      focusKeyword: "testing disciplines",
      ogImage: "/images/labs/discipline.jpg",
      canonical: "https://www.metrra.com/disciplines",
    },
    ...allCategories.map((category) => ({
      path: `/disciplines/${category.slug}`,
      title: `${category.name} | Metrra Lab`,
      description: category.excerpt,
      keywords: `${category.name.toLowerCase()}, testing laboratory, Metrra`,
      focusKeyword: category.name.toLowerCase(),
      ogImage: category.image || "/images/labs/discipline.jpg",
      categoryId: category.id,
    })),
  ];

  for (const seo of seos) {
    await prisma.seoRecord.create({
      data: {
        ...seo,
        ogTitle: seo.title,
        ogDescription: seo.description,
        robots: "index,follow",
        canonical: "canonical" in seo && seo.canonical ? seo.canonical : `https://www.metrra.com${seo.path}`,
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
