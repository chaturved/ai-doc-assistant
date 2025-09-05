import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_KEY = "access_token";
const protectedRoutes = ["/dashboard", "/profile", "/library"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_KEY); // Secure HttpOnly cookie

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      // no access token cookie, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
