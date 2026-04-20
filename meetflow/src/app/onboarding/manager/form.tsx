"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export function ManagerOnboardingForm({ defaultToken }: { defaultToken: string }) {
  const router = useRouter();
  const [token, setToken] = useState(defaultToken);
  const [displayName, setDisplayName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!token.trim() || !displayName.trim() || !position.trim()) {
      setError("すべての項目を入力してください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, displayName, position }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "招待の受諾に失敗しました。");
        return;
      }
      router.push("/manager/dashboard");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        <CardTitle>所属情報</CardTitle>
        <div>
          <Label htmlFor="token">招待コード</Label>
          <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="例: inv_xxxxxxxx" />
        </div>
        <div>
          <Label htmlFor="displayName">表示名</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="例: 山田 太郎"
          />
        </div>
        <div>
          <Label htmlFor="position">役職・肩書き</Label>
          <Input
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="例: エンジニアリングマネージャー"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="pt-2 flex justify-end">
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "処理中..." : "参加する"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
