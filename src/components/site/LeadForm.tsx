"use client";

import { FormEvent, useState } from "react";

type Props = {
  sourcePage?: string;
  categories?: string[];
  compact?: boolean;
  dark?: boolean;
  replyTo?: string;
};

export function LeadForm({
  sourcePage = "/",
  categories = [],
  compact = false,
  dark: _dark = false,
  replyTo = "contact@metrra.com",
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, sourcePage }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "The folio could not be received.");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("ok");
  }

  const field =
    "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none";
  const compactField =
    "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none";
  const input = compact ? compactField : field;

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-2.5" : "grid gap-3 sm:grid-cols-2"}>
      <input name="name" required placeholder="Name" className={input} />
      <input name="email" required type="email" placeholder="Work email" className={input} />
      {!compact && (
        <>
          <input name="company" placeholder="House / company" className={input} />
          <select name="category" className={input} defaultValue="">
            <option value="">Discipline</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value="New category">A new category</option>
          </select>
        </>
      )}
      <textarea
        name="message"
        required
        placeholder="What must be proven?"
        rows={compact ? 3 : 4}
        className={`${input} ${compact ? "" : "sm:col-span-2"}`}
      />
      <label
        className={`flex items-start gap-2 text-[11px] leading-5 ${
          compact ? "text-ink/60" : "text-ink/60 sm:col-span-2"
        }`}
      >
        <input name="privacyAccepted" type="checkbox" required value="true" className="mt-0.5" />
        <span>
          I agree that Metrra Lab may use these details to reply to this brief. See{" "}
          <a href="/privacy" className="underline">
            Privacy
          </a>
          .
        </span>
      </label>
      <button
        disabled={status === "sending"}
        className={`rounded-full px-5 py-2.5 text-[12px] tracking-[0.16em] uppercase transition ${
          compact
            ? "bg-ink text-white hover:bg-jade"
            : "bg-ink text-white hover:bg-jade"
        } ${compact ? "w-full" : "sm:col-span-2"}`}
      >
        {status === "sending" ? "Sending…" : status === "ok" ? "Received" : "Request a quote"}
      </button>
      {status === "ok" && (
        <p className={`text-xs ${compact ? "text-jade" : "text-jade sm:col-span-2"}`}>
          The house has your brief. We reply from {replyTo}.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-violet sm:col-span-2">{error}</p>
      )}
    </form>
  );
}
