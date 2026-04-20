"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { AppRole } from "@/lib/roles";

type Option = {
  role: Exclude<AppRole, "PLATFORM_ADMIN">;
  title: string;
  description: string;
};

const OPTIONS: Option[] = [
  {
    role: "CANDIDATE",
    title: "候補者として登録",
    description:
      "スカウトや応募作業なしで、あなたに合う企業との面談が自動で確定します。",
  },
  {
    role: "COMPANY_ADMIN",
    title: "企業管理者として登録",
    description:
      "求人を掲載し、面接官を招待してください。AIが候補者を自動で推薦します。",
  },
  {
    role: "HIRING_MANAGER",
    title: "面接官として登録",
    description:
      "企業管理者からの招待コードが必要です。カレンダーと空き時間を連携します。",
  },
];

export function RoleSelector() {
  const [selected, setSelected] = useState<AppRole | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!selected) {
      setError("立場を1つ選んでください。");
      return;
    }
    if (!consent) {
      setError("個人情報の利用同意にチェックしてください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected, consented: true }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "登録中にエラーが発生しました。時間をおいて再度お試しください。");
        return;
      }
      const data = (await res.json()) as { redirectTo: string };
      router.push(data.redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {OPTIONS.map((option) => {
          const isActive = selected === option.role;
          return (
            <button
              key={option.role}
              type="button"
              onClick={() => setSelected(option.role)}
              className={cn(
                "text-left transition",
                isActive ? "ring-2 ring-[var(--accent)]" : "",
                "rounded-lg"
              )}
            >
              <Card className={cn("h-full", isActive && "border-[var(--accent)]")}>
                <CardContent className="py-6">
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription className="mt-3">{option.description}</CardDescription>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* [COMPLIANCE] Explicit consent for personal-data handling is required
          by the Employment Security Act before we process the candidate. */}
      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <span>
          <span className="font-medium text-[var(--foreground)]">個人情報の利用に同意します。</span>
          <span className="mt-1 block text-[var(--muted-foreground)]">
            MeetFlowは有料職業紹介事業として運営され、登録された情報は求人企業へのマッチ提示のみに使用されます。
            利用目的の詳細は <a href="/privacy" className="underline">プライバシーポリシー</a> をご確認ください。
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={submit} disabled={isPending} size="lg">
          {isPending ? "登録中..." : "次へ進む"}
        </Button>
      </div>
    </div>
  );
}
