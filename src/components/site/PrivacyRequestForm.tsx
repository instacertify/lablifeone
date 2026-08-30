"use client";

import { FormEvent, useState } from "react";

export function PrivacyRequestForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/privacy-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "The request could not be received.");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("ok");
  }

  const field = "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-3 text-sm";

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <input name="name" required placeholder="Name" className={field} />
      <input name="email" required type="email" placeholder="Email" className={field} />
      <select name="kind" required defaultValue="access" className={`${field} sm:col-span-2`}>
        <option value="access">Access my data</option>
        <option value="erasure">Erase my data</option>
        <option value="rectification">Correct my data</option>
        <option value="objection">Object to processing</option>
        <option value="portability">Port my data</option>
        <option value="other">Another privacy request</option>
      </select>
      <textarea
        name="message"
        required
        placeholder="What should we look for — email used on a brief, pages visited, or another detail?"
        rows={4}
        className={`${field} sm:col-span-2`}
      />
      <button className="rounded-full bg-ink px-5 py-2.5 text-[12px] tracking-[0.16em] text-ivory uppercase sm:col-span-2">
        {status === "sending" ? "Sending…" : status === "ok" ? "Received" : "Send privacy request"}
      </button>
      {status === "ok" && (
        <p className="text-xs text-jade sm:col-span-2">
          The house has the request. We reply from contact@metrra.com.
        </p>
      )}
      {status === "error" && <p className="text-xs text-violet sm:col-span-2">{error}</p>}
    </form>
  );
}
