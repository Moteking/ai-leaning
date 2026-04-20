import { redirect } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { CompanyOnboardingForm } from "./form";

export default async function CompanyOnboardingPage() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { companyAdmins: { select: { id: true } } },
  });
  if ((user?.companyAdmins.length ?? 0) > 0) redirect("/company/dashboard");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">COMPANY ONBOARDING</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">会社情報を登録</h1>
      <p className="mt-4 max-w-xl text-[var(--muted-foreground)]">
        マッチングの精度に直結する情報です。あとから編集できます。
      </p>
      <div className="mt-10">
        <CompanyOnboardingForm />
      </div>
    </main>
  );
}
