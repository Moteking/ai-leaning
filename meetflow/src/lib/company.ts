import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireCompanyForAdmin(clerkId: string): Promise<{
  companyId: string;
  userId: string;
}> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { companyAdmins: true },
  });
  if (!user) redirect("/sign-in");
  if (user.role !== "COMPANY_ADMIN") redirect("/dashboard");
  const first = user.companyAdmins[0];
  if (!first) redirect("/onboarding/company");
  return { companyId: first.companyId, userId: user.id };
}
