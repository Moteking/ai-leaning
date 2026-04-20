import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AppRole =
  | "CANDIDATE"
  | "COMPANY_ADMIN"
  | "HIRING_MANAGER"
  | "PLATFORM_ADMIN";

export const ROLE_LABELS: Record<AppRole, string> = {
  CANDIDATE: "候補者",
  COMPANY_ADMIN: "企業管理者",
  HIRING_MANAGER: "面接官",
  PLATFORM_ADMIN: "職業紹介責任者",
};

const ROLE_HOMES: Record<AppRole, string> = {
  CANDIDATE: "/dashboard",
  COMPANY_ADMIN: "/company/dashboard",
  HIRING_MANAGER: "/manager/dashboard",
  PLATFORM_ADMIN: "/admin/dashboard",
};

// Where the user lands *right after* picking a role. They still need to finish
// persona-specific onboarding before they can use the dashboard.
const ONBOARDING_NEXT: Record<AppRole, string> = {
  CANDIDATE: "/onboarding/candidate",
  COMPANY_ADMIN: "/onboarding/company",
  HIRING_MANAGER: "/onboarding/manager",
  PLATFORM_ADMIN: "/admin/dashboard",
};

export function homeForRole(role: AppRole): string {
  return ROLE_HOMES[role];
}

export function onboardingNextForRole(role: AppRole): string {
  return ONBOARDING_NEXT[role];
}

function parseRole(value: unknown): AppRole | null {
  if (typeof value !== "string") return null;
  if (
    value === "CANDIDATE" ||
    value === "COMPANY_ADMIN" ||
    value === "HIRING_MANAGER" ||
    value === "PLATFORM_ADMIN"
  ) {
    return value;
  }
  return null;
}

export async function requireRole(allowed: AppRole | AppRole[]): Promise<{ userId: string; role: AppRole }> {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");

  const metadata = (sessionClaims as { publicMetadata?: Record<string, unknown> } | null)?.publicMetadata ?? {};
  const role = parseRole(metadata.role);
  if (!role) redirect("/onboarding");

  const allowedList = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedList.includes(role) && role !== "PLATFORM_ADMIN") {
    redirect(homeForRole(role));
  }

  return { userId, role };
}

export async function currentRole(): Promise<AppRole | null> {
  const { sessionClaims } = await auth();
  const metadata = (sessionClaims as { publicMetadata?: Record<string, unknown> } | null)?.publicMetadata ?? {};
  return parseRole(metadata.role);
}
