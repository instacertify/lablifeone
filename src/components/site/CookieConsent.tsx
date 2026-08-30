"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CHANGE_CONSENT_EVENT,
  OPEN_CONSENT_EVENT,
  acceptAllConsent,
  hasGlobalPrivacyControl,
  necessaryOnly,
  readStoredConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";

type Draft = Pick<ConsentState, "preferences" | "analytics" | "marketing">;

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE_CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_CONSENT_EVENT, onChange);
}

export function CookieConsent() {
  const stored = useSyncExternalStore(subscribeConsent, readStoredConsent, () => null);
  const [panel, setPanel] = useState<"closed" | "banner" | "customize">("closed");
  const [draft, setDraft] = useState<Draft>({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    function onOpen() {
      const current = readStoredConsent() || necessaryOnly();
      setDraft(current);
      setPanel("customize");
    }
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);

    const frame = window.requestAnimationFrame(() => {
      if (readStoredConsent()) return;
      if (hasGlobalPrivacyControl()) {
        writeConsent(necessaryOnly());
        return;
      }
      setPanel("banner");
    });

    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function save(next: ConsentState) {
    writeConsent(next);
    setDraft(next);
    setPanel("closed");
  }

  if (panel === "closed") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-ink p-5 text-ivory shadow-2xl md:p-7">
        <p className="text-[11px] tracking-[0.2em] text-aqua uppercase">Cookies and privacy</p>
        <h2 className="display mt-2 text-3xl">A choice before any optional cookie</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-sand/80">
          Essential cookies keep the site and Conservatory sign-in working. Analytics, marketing, and
          preference cookies wait for your choice. Read the{" "}
          <Link href="/cookies" className="underline decoration-white/40 hover:decoration-white">
            Cookie policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline decoration-white/40 hover:decoration-white">
            Privacy notice
          </Link>
          .
        </p>

        {panel === "customize" && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl border border-white/10 p-4 text-sm">
              <input type="checkbox" checked disabled className="mr-2" />
              Essential — always on
              <span className="mt-1 block text-xs text-sand/55">
                Security, consent memory, Conservatory session.
              </span>
            </label>
            {(
              [
                ["preferences", "Preferences"],
                ["analytics", "Analytics"],
                ["marketing", "Marketing"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="rounded-2xl border border-white/10 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={draft[key]}
                  onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.checked }))}
                  className="mr-2"
                />
                {label}
                <span className="mt-1 block text-xs text-sand/55">
                  {key === "preferences" && "Remember display choices you make on this device."}
                  {key === "analytics" && "Measure visits. Nothing loads until you allow it."}
                  {key === "marketing" && "Campaign measurement. Nothing loads until you allow it."}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save(acceptAllConsent())}
            className="rounded-full bg-white px-4 py-2 text-[11px] tracking-[0.16em] text-ink uppercase"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => save(necessaryOnly())}
            className="rounded-full border border-white/30 px-4 py-2 text-[11px] tracking-[0.16em] uppercase"
          >
            Reject non-essential
          </button>
          {panel === "customize" ? (
            <button
              type="button"
              onClick={() => save({ ...necessaryOnly(), ...draft })}
              className="rounded-full border border-white/30 px-4 py-2 text-[11px] tracking-[0.16em] uppercase"
            >
              Save choices
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(stored || necessaryOnly());
                setPanel("customize");
              }}
              className="rounded-full border border-white/30 px-4 py-2 text-[11px] tracking-[0.16em] uppercase"
            >
              Customize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsLink({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}

export function ConsentScripts() {
  const stored = useSyncExternalStore(subscribeConsent, readStoredConsent, () => null);
  useEffect(() => {
    if (!stored?.analytics && !stored?.marketing) {
      // No third-party tags load until a Conservatory-approved script is added here.
    }
  }, [stored]);
  return null;
}
