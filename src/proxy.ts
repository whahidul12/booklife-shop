/**
 * Next.js 16 Proxy (replaces middleware.ts).
 *
 * For authenticated routes we do a full session check using auth.api.getSession()
 * which is safe in Next.js 16's proxy runtime (Node.js, not Edge).
 *
 * Protected route groups:
 *  - /account/**      → must be logged in
 *  - /cart/**         → must be logged in
 *  - /checkout/**     → must be logged in
 *  - /dashboard/**    → must be logged in + admin or moderator role
 *
 * Public routes (/sign-in, /sign-up, /) pass through without any check.
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require the user to be authenticated
const AUTH_REQUIRED = ["/account", "/cart", "/checkout"];

// Routes that require admin or moderator role
const STAFF_REQUIRED = ["/dashboard"];

// Routes that logged-in users should not be able to visit (redirect to home)
const GUEST_ONLY = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRequired = AUTH_REQUIRED.some((p) => pathname.startsWith(p));
  const isStaffRequired = STAFF_REQUIRED.some((p) => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY.some((p) => pathname.startsWith(p));

  // Fast path: if the route doesn't need protection, pass through
  if (!isAuthRequired && !isStaffRequired && !isGuestOnly) {
    return NextResponse.next();
  }

  // Full session validation (safe in Next.js 16 proxy — Node.js runtime)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect unauthenticated users to sign-in
  if (!session && (isAuthRequired || isStaffRequired)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from guest-only pages
  if (session && isGuestOnly) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Staff-only: must be admin or moderator
  if (isStaffRequired && session) {
    const role = (session.user as { role?: string }).role ?? "customer";
    if (role !== "admin" && role !== "moderator") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
