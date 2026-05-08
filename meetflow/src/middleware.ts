import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isCompanyRoute = createRouteMatcher(["/company(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  // Public diagnostic flow for applicants — no Clerk auth, token-gated.
  "/apply(.*)",
  "/api/apply(.*)",
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

  if (!role && !url.pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  const denied = (role: string) => {
    if (role === "COMPANY_ADMIN") return NextResponse.redirect(new URL("/company/dashboard", req.url));
    if (role === "HIRING_MANAGER") return NextResponse.redirect(new URL("/manager/dashboard", req.url));
    return NextResponse.redirect(new URL("/", req.url));
  };

  if (isCompanyRoute(req) && role !== "COMPANY_ADMIN" && role !== "PLATFORM_ADMIN") {
    return denied(role ?? "");
  }
  if (isManagerRoute(req) && role !== "HIRING_MANAGER" && role !== "PLATFORM_ADMIN") {
    return denied(role ?? "");
  }
  if (isAdminRoute(req) && role !== "PLATFORM_ADMIN") {
    return denied(role ?? "");
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
