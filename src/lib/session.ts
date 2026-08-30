import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "mettra_folio";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return new TextEncoder().encode(value);
}

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.email || !payload.name) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}
