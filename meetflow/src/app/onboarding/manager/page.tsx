import { redirect } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { ManagerOnboardingForm } from "./form";

export default async function ManagerOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { userId } = await requireRole("HIRING_MANAGER");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { hiringManager: { select: { id: true } } },
  });
  if (user?.hiringManager) redirect("/manager/dashboard");

  const params = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">HIRING MANAGER ONBOARDING</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">招待コードを入力</h1>
      <p className="mt-4 text-[var(--muted-foreground)]">
        所属企業の管理者から届いた招待メールに記載されているコードを入力してください。
      </p>
      <div className="mt-10">
        <ManagerOnboardingForm defaultToken={params.invite ?? ""} />
      </div>
    </main>
  );
}
