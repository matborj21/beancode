import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/login"];
const ADMIN_ROUTES = ["/dashboard", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // Already logged in → redirect away from login
  if (isPublic && token) {
    const redirectUrl = token.role === "ADMIN" ? "/dashboard" : "/mobile";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Not logged in → redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Cashier/Barista trying to access admin → block
  if (
    token &&
    token.role !== "ADMIN" &&
    ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.redirect(new URL("/mobile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
