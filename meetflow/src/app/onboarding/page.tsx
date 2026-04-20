import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RoleSelector } from "./role-selector";
import { currentRole, onboardingNextForRole } from "@/lib/roles";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const role = await currentRole();
  if (role) redirect(onboardingNextForRole(role));

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm text-[var(--muted-foreground)]">ようこそ</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">
        はじめに、あなたの立場を選んでください
      </h1>
      <p className="mt-4 text-[var(--muted-foreground)]">
        選んだ立場によって表示される画面が変わります。あとから運営にお問い合わせいただければ変更できます。
      </p>
      <div className="mt-10">
        <RoleSelector />
      </div>
    </main>
  );
}
