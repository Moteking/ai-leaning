"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RunBatchButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run() {
    setStatus(null);
    startTransition(async () => {
      const res = await fetch("/api/cron/generate-matches", { method: "POST" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus(body.error ?? "バッチに失敗しました。");
        return;
      }
      const data = (await res.json()) as {
        report: { perCandidate: { persisted: number }[]; candidatesBackfilled: number; jobsBackfilled: number };
      };
      const persisted = data.report.perCandidate.reduce((a, s) => a + s.persisted, 0);
      setStatus(
        `完了。${persisted}件のマッチを生成、候補者embed ${data.report.candidatesBackfilled}件/求人embed ${data.report.jobsBackfilled}件を補填。`
      );
      router.refresh();
    });
  }

  return (
    <div className="text-right">
      <Button onClick={run} disabled={isPending}>
        {isPending ? "実行中..." : "いま実行"}
      </Button>
      {status && <p className="mt-2 max-w-xs text-xs text-[var(--muted-foreground)]">{status}</p>}
    </div>
  );
}
