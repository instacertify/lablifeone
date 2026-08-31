import Link from "next/link";
import { CookieSettingsLink } from "@/components/site/CookieConsent";
import { getSeoByPath } from "@/lib/data";
import { safeMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return safeMetadata(() => getSeoByPath("/cookies"), {
    title: "Cookie policy | Metrra Lab",
    description:
      "How Metrra Lab uses cookies and similar technologies, and how to accept, refuse, or change a choice.",
    path: "/cookies",
  });
}

const rows = [
  {
    name: "metrra_consent",
    category: "Essential",
    purpose: "Remembers your cookie categories so we do not ask on every page.",
    duration: "180 days",
  },
  {
    name: "metrra_folio",
    category: "Essential",
    purpose: "Staff Conservatory session only. HttpOnly, SameSite=Lax. Not set for public visitors.",
    duration: "7 days",
  },
];

export default async function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Legal</p>
      <h1 className="display mt-3 text-5xl">Cookie policy</h1>
      <p className="mt-4 text-sm text-ink/55">Last updated 30 August 2026. Applies worldwide.</p>

      <div className="prose prose-lg mt-8 max-w-none prose-headings:font-serif">
        <p>
          Cookies are small files stored on your device. Metrra Lab uses them only as described
          here. Non-essential cookies wait for a yes. Rejecting them is as easy as accepting. You
          can change a choice later. See also the <Link href="/privacy">Privacy notice</Link>.
        </p>

        <h2>Categories</h2>
        <ul>
          <li>
            <strong>Essential</strong> — required to deliver the page you asked for, keep the site
            secure, and remember this choice. These do not need consent.
          </li>
          <li>
            <strong>Preferences</strong> — remember display choices. Off until you allow them.
          </li>
          <li>
            <strong>Analytics</strong> — measure visits. No analytics tag loads until you allow it.
          </li>
          <li>
            <strong>Marketing</strong> — campaign measurement. No marketing tag loads until you
            allow it.
          </li>
        </ul>

        <h2>Cookies we set today</h2>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/8">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-mist text-[11px] tracking-[0.16em] text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Cookie</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Purpose</th>
              <th className="px-4 py-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-ink/8">
                <td className="px-4 py-3 font-mono text-xs">{row.name}</td>
                <td className="px-4 py-3">{row.category}</td>
                <td className="px-4 py-3 text-ink/70">{row.purpose}</td>
                <td className="px-4 py-3">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-lg mt-10 max-w-none prose-headings:font-serif">
        <p>
          If you allow analytics or marketing later, this table will name those cookies before they
          load. A Global Privacy Control (GPC) signal is treated as a reject of non-essential
          cookies.
        </p>
      </div>

      <div className="mt-10">
        <CookieSettingsLink className="rounded-full bg-ink px-5 py-2.5 text-[12px] tracking-[0.16em] text-ivory uppercase" />
      </div>
    </div>
  );
}
