export const CONSENT_COOKIE = "metrra_consent";
export const CONSENT_STORAGE_KEY = "metrra_consent";
export const CONSENT_VERSION = "2026-08";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const OPEN_CONSENT_EVENT = "metrra-open-cookie-settings";
export const CHANGE_CONSENT_EVENT = "metrra-consent-change";

export type ConsentState = {
  version: string;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const necessaryOnly = (): ConsentState => ({
  version: CONSENT_VERSION,
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
});

export const acceptAllConsent = (): ConsentState => ({
  ...necessaryOnly(),
  preferences: true,
  analytics: true,
  marketing: true,
});

export function parseConsent(raw: string | null | undefined): ConsentState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentState>;
    if (value.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      preferences: Boolean(value.preferences),
      analytics: Boolean(value.analytics),
      marketing: Boolean(value.marketing),
      updatedAt: value.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

let cachedConsent: ConsentState | null | undefined = undefined;
let cachedRaw: string | null = null;

export function readStoredConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const storageValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  const cookieValue = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  const cookieDecoded = cookieValue
    ? decodeURIComponent(cookieValue.slice(CONSENT_COOKIE.length + 1))
    : null;
  const currentRaw = storageValue || cookieDecoded;
  if (currentRaw === cachedRaw) return cachedConsent ?? null;
  cachedRaw = currentRaw;
  cachedConsent = parseConsent(currentRaw);
  return cachedConsent ?? null;
}

export function writeConsent(state: ConsentState) {
  if (typeof document === "undefined") return;
  const payload = JSON.stringify(state);
  cachedRaw = payload;
  cachedConsent = state;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(payload)}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CHANGE_CONSENT_EVENT, { detail: state }));
}

export function hasGlobalPrivacyControl() {
  if (typeof navigator === "undefined") return false;
  return Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
