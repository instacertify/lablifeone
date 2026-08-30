import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function getConservatorySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await readSessionToken(token);
  if (!session) return null;
  const admin = await prisma.admin.findUnique({ where: { id: session.sub } });
  if (!admin) return null;
  return { id: admin.id, email: admin.email, name: admin.name };
}

export async function requireConservatory() {
  const session = await getConservatorySession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
