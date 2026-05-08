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
    role: "COMPANY_ADMIN",
    title: "企業管理者として登録",
    description:
      "求人を掲載し、性格診断テンプレートを設定します。応募者をアップロードして AI スコアを取得します。",
  },
  {
    role: "HIRING_MANAGER",
    title: "面接官として登録",
    description:
      "企業管理者からの招待コードが必要です。応募者の AI 評価を確認し、面接判断に活用します。",
  },
];

export function RoleSelector() {
  const [selected, setSelected] = useState<AppRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!selected) {
      setError("立場を1つ選んでください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
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
      <div className="grid gap-4 md:grid-cols-2">
        {OPTIONS.map((option) => {
          const isActive = selected === option.role;
          return (
            <button
              key={option.role}
              type="button"
              onClick={() => setSelected(option.role)}
              className={cn("rounded-lg text-left transition", isActive && "ring-2 ring-[var(--accent)]")}
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={submit} disabled={isPending} size="lg">
          {isPending ? "登録中..." : "次へ進む"}
        </Button>
      </div>
    </div>
  );
}
