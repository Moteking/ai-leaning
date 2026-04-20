"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  matchId: string;
  fitScore: number;
  status: string;
  candidateName: string;
  candidatePosition: string;
  jobTitle: string;
  companyName: string;
  reasoning: string;
  concerns: string[];
};

export function MatchAuditRow(props: Props) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reject() {
    if (note.trim().length < 5) {
      setError("無効化理由を5文字以上で入力してください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/matches/${props.matchId}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "REJECT", reason: note }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "操作に失敗しました。");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-lg">
            {props.candidateName} <span className="text-[var(--muted-foreground)]">×</span> {props.jobTitle}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {props.candidatePosition || "(現職未記入)"} / {props.companyName} / 状態 {props.status}
          </p>
          {props.reasoning && (
            <p className="mt-3 text-sm text-[var(--foreground)]">{props.reasoning}</p>
          )}
          {props.concerns.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-xs text-[var(--muted-foreground)]">
              {props.concerns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-right">
          <p className="font-serif text-3xl text-[var(--accent)]">{Math.round(props.fitScore)}</p>
          <p className="text-xs text-[var(--muted-foreground)]">FitScore</p>
        </div>
      </div>

      {showNote ? (
        <div className="mt-4 space-y-2">
          <Input
            placeholder="無効化の理由 (監査ログに記録されます)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowNote(false)} disabled={isPending}>
              キャンセル
            </Button>
            <Button size="sm" onClick={reject} disabled={isPending}>
              {isPending ? "処理中..." : "無効化を確定"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowNote(true)}>
            無効化
          </Button>
        </div>
      )}
    </div>
  );
}
