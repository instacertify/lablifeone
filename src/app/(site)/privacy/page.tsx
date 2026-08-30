import Link from "next/link";
import { PrivacyRequestForm } from "@/components/site/PrivacyRequestForm";
import { getSeoByPath, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getSeoByPath("/privacy");
  return buildMetadata(seo, {
    title: "Privacy notice | Metrra Lab",
    description:
      "How Metrra Lab processes personal data for quotes, cookies, and privacy rights — GDPR and global privacy standards.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const settings = await getSettings();
  const email = settings?.email || "contact@metrra.com";

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="text-[11px] tracking-[0.2em] text-jade uppercase">Legal</p>
      <h1 className="display mt-3 text-5xl">Privacy notice</h1>
      <p className="mt-4 text-sm text-ink/55">Last updated 30 August 2026. Applies worldwide.</p>

      <div className="prose prose-lg mt-8 max-w-none prose-headings:font-serif">
        <p>
          Metrra Lab (“we”) is the controller of personal data collected on www.metrra.com. Write to{" "}
          <a href={`mailto:${email}`}>{email}</a>. This notice covers visitors, people who request a
          quote, and people who exercise a privacy right. It is written for GDPR, UK GDPR, and
          comparable global rules including CCPA/CPRA notice requirements.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Quote briefs</strong> — name, email, optional company and phone, the discipline
            you name, your message, and the page you wrote from.
          </li>
          <li>
            <strong>Privacy requests</strong> — name, email, the right you exercise, and your note.
          </li>
          <li>
            <strong>Cookie choices</strong> — a first-party record of essential / preferences /
            analytics / marketing decisions, stored as <code>metrra_consent</code>.
          </li>
          <li>
            <strong>Conservatory sign-in</strong> — an HttpOnly session cookie for staff only, never
            set for public browsing.
          </li>
        </ul>
        <p>
          We do not run analytics or marketing tags until you allow those categories. We do not sell
          personal information and we do not share it for cross-context behavioural advertising.
        </p>

        <h2>Why we use it (legal bases)</h2>
        <ul>
          <li>
            <strong>Quote briefs</strong> — steps prior to a contract (GDPR Art. 6(1)(b)) and our
            legitimate interest in answering a professional enquiry (Art. 6(1)(f)). You confirm this
            on the form.
          </li>
          <li>
            <strong>Privacy requests</strong> — legal obligation (Art. 6(1)(c)).
          </li>
          <li>
            <strong>Essential cookies</strong> — legitimate interest in running a secure site, or
            necessity for the service you asked for.
          </li>
          <li>
            <strong>Preferences, analytics, marketing cookies</strong> — consent (Art. 6(1)(a) and
            ePrivacy). You may refuse or withdraw at any time via Cookie settings.
          </li>
        </ul>

        <h2>How long we keep it</h2>
        <p>
          Quote briefs and privacy requests stay in The Conservatory until we have answered them and
          for up to 24 months unless a longer legal hold applies or you ask us to erase them sooner
          where the law allows. Cookie choices last 180 days, then we ask again. Staff sessions last
          seven days.
        </p>

        <h2>Who we share it with</h2>
        <p>
          Hosting and email infrastructure that process data on our instructions. We do not sell
          lists. If a processor sits outside your country, we use a lawful transfer tool where
          required (for example Standard Contractual Clauses).
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may request access, correction, erasure, restriction,
          objection, portability, and withdrawal of consent. California residents may also request
          to know, delete, or correct personal information and to opt out of sale or sharing — we
          do not sell or share. We honour Global Privacy Control (GPC) as a reject of non-essential
          cookies. You may complain to a supervisory authority; in the EEA that is your local DPA,
          in the UK the ICO.
        </p>
        <p>
          Cookie details live on the <Link href="/cookies">Cookie policy</Link>. Change a choice
          any time from Cookie settings in the footer.
        </p>
      </div>

      <div className="mt-12 rounded-3xl bg-mist p-6">
        <h2 className="display text-3xl">Exercise a right</h2>
        <p className="mt-2 mb-5 text-sm text-ink/65">
          We will reply from {email}. We may need to confirm it is you before we act.
        </p>
        <PrivacyRequestForm />
      </div>
    </div>
  );
}
