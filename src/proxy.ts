import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/conservatory")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/conservatory/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await readSessionToken(token) : null;
  if (!session) {
    const login = new URL("/conservatory/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/conservatory/:path*"],
};
