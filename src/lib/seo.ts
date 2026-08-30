export type SeoInput = {
  title?: string | null;
  description?: string | null;
  focusKeyword?: string | null;
  keywords?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  robots?: string | null;
  content?: string | null;
};

export type SeoCheck = {
  id: string;
  label: string;
  hint: string;
  pass: boolean;
};

export type SeoScore = {
  score: number;
  grade: "A" | "B" | "C" | "D";
  checks: SeoCheck[];
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function evaluateSeo(input: SeoInput): SeoScore {
  const title = input.title?.trim() ?? "";
  const description = input.description?.trim() ?? "";
  const focus = input.focusKeyword?.trim().toLowerCase() ?? "";
  const content = stripHtml(input.content ?? "");
  const contentLower = content.toLowerCase();

  const checks: SeoCheck[] = [
    {
      id: "title-length",
      label: "Title length",
      hint: "Keep titles between 45 and 60 characters.",
      pass: title.length >= 45 && title.length <= 60,
    },
    {
      id: "title-keyword",
      label: "Focus keyword in title",
      hint: "Place the focus phrase near the start of the title.",
      pass: Boolean(focus) && title.toLowerCase().includes(focus),
    },
    {
      id: "description-length",
      label: "Meta description length",
      hint: "Aim for 140–160 characters of specific, human copy.",
      pass: description.length >= 140 && description.length <= 165,
    },
    {
      id: "description-keyword",
      label: "Focus keyword in description",
      hint: "Repeat the phrase naturally in the description.",
      pass: Boolean(focus) && description.toLowerCase().includes(focus),
    },
    {
      id: "og-complete",
      label: "Open Graph complete",
      hint: "Set OG title, description, and a 1200×630 image.",
      pass: Boolean(input.ogTitle && input.ogDescription && input.ogImage),
    },
    {
      id: "canonical",
      label: "Canonical URL",
      hint: "Canonical should be an absolute https URL.",
      pass: Boolean(input.canonical?.startsWith("https://")),
    },
    {
      id: "robots",
      label: "Indexable robots",
      hint: "Use index,follow unless the page is private.",
      pass: (input.robots ?? "index,follow").includes("index"),
    },
    {
      id: "content-depth",
      label: "Substance in the folio",
      hint: "Editorial pages should carry at least 300 words.",
      pass: content.split(" ").filter(Boolean).length >= 300,
    },
    {
      id: "keyword-body",
      label: "Keyword appears in body",
      hint: "Use the focus phrase once in the opening passage.",
      pass: Boolean(focus) && contentLower.includes(focus),
    },
    {
      id: "keywords-list",
      label: "Supporting keywords",
      hint: "Add 3–8 comma-separated supporting terms.",
      pass: (input.keywords ?? "").split(",").filter((part) => part.trim()).length >= 3,
    },
  ];

  const passed = checks.filter((check) => check.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D";

  return { score, grade, checks };
}

export function siteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mettra.com";
  if (path.startsWith("http")) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
