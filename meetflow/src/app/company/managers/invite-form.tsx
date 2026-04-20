"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export function InviteManagerForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!email.trim()) {
      setError("メールアドレスを入力してください。");
      return;
    }
    setError(null);
    setToken(null);
    startTransition(async () => {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "HIRING_MANAGER" }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "招待に失敗しました。");
        return;
      }
      const data = (await res.json()) as { token: string };
      setToken(data.token);
      setEmail("");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        <CardTitle>面接官を招待</CardTitle>
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {token && (
          <div className="rounded-md bg-[var(--card)] p-3 text-sm">
            <p>招待コードを発行しました:</p>
            <p className="mt-2 break-all font-mono text-xs">{token}</p>
            <p className="mt-2 text-[var(--muted-foreground)]">
              相手にこのコード、または {`/onboarding/manager?invite=${token}`} のリンクを共有してください。
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "発行中..." : "招待コードを発行"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
