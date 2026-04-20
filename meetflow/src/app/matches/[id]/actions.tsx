"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MatchResponseActions({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function respond(decision: "ACCEPT" | "DECLINE") {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/matches/${matchId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "処理に失敗しました。");
        return;
      }
      router.push("/matches");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg">このマッチに進みますか?</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            承諾すると次のステップで面談日程が自動確定します (Phase 4 以降)。
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => respond("DECLINE")} disabled={isPending}>
            辞退
          </Button>
          <Button onClick={() => respond("ACCEPT")} disabled={isPending}>
            {isPending ? "送信中..." : "承諾して面談へ"}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600 md:w-full">{error}</p>}
      </CardContent>
    </Card>
  );
}
