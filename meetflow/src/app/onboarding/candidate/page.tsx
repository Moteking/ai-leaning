import { redirect } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { CandidateOnboardingWizard } from "./wizard";

export default async function CandidateOnboardingPage() {
  const { userId } = await requireRole("CANDIDATE");

  // Already onboarded? Skip to dashboard.
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, candidateProfile: { select: { id: true } } },
  });
  if (user?.candidateProfile) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">CANDIDATE ONBOARDING</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">プロフィールを作成</h1>
      <p className="mt-4 max-w-xl text-[var(--muted-foreground)]">
        職務経歴書を貼り付けると、AIが構造化して整形します。次にカルチャー診断を5問。
        あとから編集できるのでラフで大丈夫です。
      </p>
      <div className="mt-10">
        <CandidateOnboardingWizard />
      </div>
    </main>
  );
}
