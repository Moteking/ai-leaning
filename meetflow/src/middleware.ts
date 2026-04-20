import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Role-gated route matchers. Each one captures the section of the app reserved
// for that role. We additionally accept PLATFORM_ADMIN on every section so the
// job-placement officer can audit every screen.
const isCandidateRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/matches(.*)",
  "/meetings(.*)",
  "/availability(.*)",
  "/profile(.*)",
  "/onboarding(.*)",
]);
const isCompanyRoute = createRouteMatcher(["/company(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/privacy",
  "/terms",
  "/compliance",
  "/contact",
]);

function readRole(sessionClaims: unknown): string | undefined {
  if (typeof sessionClaims !== "object" || sessionClaims === null) return undefined;
  const metadata = (sessionClaims as Record<string, unknown>).publicMetadata;
  if (typeof metadata !== "object" || metadata === null) return undefined;
  const role = (metadata as Record<string, unknown>).role;
  return typeof role === "string" ? role : undefined;
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

  const role = readRole(sessionClaims);
  const url = new URL(req.url);

  // New user without role → onboarding picker.
  if (!role && !url.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  const denied = () => NextResponse.redirect(new URL("/dashboard", req.url));

  if (isCompanyRoute(req) && role !== "COMPANY_ADMIN" && role !== "PLATFORM_ADMIN") {
    return denied();
  }
  if (isManagerRoute(req) && role !== "HIRING_MANAGER" && role !== "PLATFORM_ADMIN") {
    return denied();
  }
  if (isAdminRoute(req) && role !== "PLATFORM_ADMIN") {
    return denied();
  }
  if (isCandidateRoute(req) && role && role !== "CANDIDATE" && role !== "PLATFORM_ADMIN") {
    // Non-candidates landing on /dashboard get bounced to their own home.
    if (url.pathname.startsWith("/dashboard")) {
      if (role === "COMPANY_ADMIN") return NextResponse.redirect(new URL("/company/dashboard", req.url));
      if (role === "HIRING_MANAGER") return NextResponse.redirect(new URL("/manager/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
