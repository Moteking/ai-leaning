import { redirect } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { CandidateProfileForm } from "./form";

const NAV = [
  { label: "ホーム", href: "/dashboard" },
  { label: "マッチ一覧", href: "/matches" },
  { label: "確定面談", href: "/meetings" },
  { label: "空き時間", href: "/availability" },
  { label: "プロフィール", href: "/profile" },
];

export default async function ProfilePage() {
  const { userId } = await requireRole("CANDIDATE");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { candidateProfile: true },
  });
  if (!user?.candidateProfile) redirect("/onboarding/candidate");

  const profile = user.candidateProfile;

  return (
    <AppShell title="候補者" nav={NAV}>
      <header className="max-w-3xl">
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">PROFILE</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">プロフィールを編集</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          マッチング精度に直結します。現職の秘匿など、注記があれば本文に含めてください。
        </p>
      </header>
      <section className="mt-8 max-w-3xl">
        <CandidateProfileForm
          initial={{
            displayName: profile.displayName,
            currentPosition: profile.currentPosition ?? "",
            yearsOfExperience: profile.yearsOfExperience ?? 0,
            skills: profile.skills,
            desiredRoles: profile.desiredRoles,
            workStyle: profile.workStyle,
            desiredSalaryMin: profile.desiredSalaryMin,
            desiredSalaryMax: profile.desiredSalaryMax,
            resumeText: profile.resumeText ?? "",
          }}
        />
      </section>
    </AppShell>
  );
}
