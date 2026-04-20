"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { CULTURE_QUESTIONS, type CultureAnswers } from "@/lib/culture-questions";
import { cn } from "@/lib/cn";

type ResumeStructure = {
  displayName: string;
  currentPosition: string;
  yearsOfExperience: number;
  skills: string[];
  desiredRoles: string[];
  summary: string;
};

type WorkStyle = "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE";

const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: "REMOTE", label: "フルリモート" },
  { value: "HYBRID", label: "ハイブリッド" },
  { value: "ONSITE", label: "フル出社" },
  { value: "FLEXIBLE", label: "柔軟" },
];

type Step = "resume" | "review" | "culture" | "saving";

export function CandidateOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("resume");
  const [resumeText, setResumeText] = useState("");
  const [structure, setStructure] = useState<ResumeStructure | null>(null);
  const [workStyle, setWorkStyle] = useState<WorkStyle>("FLEXIBLE");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [answers, setAnswers] = useState<CultureAnswers>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function parse() {
    if (resumeText.trim().length < 50) {
      setError("職務経歴書の本文を50文字以上入力してください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/onboarding/candidate/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "AI による整形に失敗しました。本文を確認して再度お試しください。");
        return;
      }
      const data = (await res.json()) as { structure: ResumeStructure };
      setStructure(data.structure);
      setStep("review");
    });
  }

  async function save() {
    if (!structure) return;
    const unanswered = CULTURE_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError("すべての診断に回答してください。");
      return;
    }
    setError(null);
    setStep("saving");
    startTransition(async () => {
      const res = await fetch("/api/onboarding/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: structure.displayName,
          currentPosition: structure.currentPosition,
          yearsOfExperience: structure.yearsOfExperience,
          skills: structure.skills,
          desiredRoles: structure.desiredRoles,
          workStyle,
          desiredSalaryMin: salaryMin === "" ? null : Number(salaryMin),
          desiredSalaryMax: salaryMax === "" ? null : Number(salaryMax),
          cultureAnswers: answers,
          resumeText,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "保存に失敗しました。");
        setStep("culture");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  if (step === "resume") {
    return (
      <section className="space-y-4">
        <div>
          <Label htmlFor="resume">職務経歴書(テキスト)</Label>
          <Textarea
            id="resume"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={16}
            placeholder={"例:\n株式会社○○ (2020年4月〜現在)\n - バックエンドエンジニアとして、Go/TypeScriptで決済基盤を開発..."}
          />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            PDF には未対応です。本文をコピーして貼り付けてください。年齢・性別などの個人属性は記載不要です。
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end">
          <Button onClick={parse} disabled={isPending} size="lg">
            {isPending ? "AI が整形中..." : "次へ (AI 整形)"}
          </Button>
        </div>
      </section>
    );
  }

  if (step === "review" && structure) {
    return (
      <section className="space-y-6">
        <Card>
          <CardContent className="py-6">
            <CardTitle>AI の整形結果を確認</CardTitle>
            <CardDescription>必要に応じて編集してください。</CardDescription>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <Label>氏名</Label>
                <Input
                  value={structure.displayName}
                  onChange={(e) => setStructure({ ...structure, displayName: e.target.value })}
                />
              </div>
              <div>
                <Label>現職・職種</Label>
                <Input
                  value={structure.currentPosition}
                  onChange={(e) => setStructure({ ...structure, currentPosition: e.target.value })}
                />
              </div>
              <div>
                <Label>経験年数</Label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={structure.yearsOfExperience}
                  onChange={(e) =>
                    setStructure({ ...structure, yearsOfExperience: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label>希望職種 (カンマ区切り)</Label>
                <Input
                  value={structure.desiredRoles.join(", ")}
                  onChange={(e) =>
                    setStructure({
                      ...structure,
                      desiredRoles: splitList(e.target.value),
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label>スキル (カンマ区切り)</Label>
                <Input
                  value={structure.skills.join(", ")}
                  onChange={(e) => setStructure({ ...structure, skills: splitList(e.target.value) })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>経歴サマリ</Label>
                <Textarea
                  value={structure.summary}
                  onChange={(e) => setStructure({ ...structure, summary: e.target.value })}
                  rows={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <CardTitle>希望条件</CardTitle>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <Label>勤務スタイル</Label>
                <Select value={workStyle} onChange={(e) => setWorkStyle(e.target.value as WorkStyle)}>
                  {WORK_STYLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>希望年収 下限 (万円)</Label>
                <Input
                  type="number"
                  min={0}
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="例: 600"
                />
              </div>
              <div>
                <Label>希望年収 上限 (万円)</Label>
                <Input
                  type="number"
                  min={0}
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="例: 900"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("resume")}>
            戻る
          </Button>
          <Button onClick={() => setStep("culture")}>次へ (カルチャー診断)</Button>
        </div>
      </section>
    );
  }

  // Culture diagnostic
  return (
    <section className="space-y-6">
      <Card>
        <CardContent className="py-6">
          <CardTitle>カルチャーフィット診断 (5問)</CardTitle>
          <CardDescription>あなたに合う職場環境を見立てるための診断です。</CardDescription>
          <div className="mt-6 space-y-6">
            {CULTURE_QUESTIONS.map((q, idx) => (
              <div key={q.id}>
                <p className="font-serif text-lg">
                  <span className="mr-2 text-[var(--muted-foreground)]">Q{idx + 1}.</span>
                  {q.prompt}
                </p>
                <div className="mt-3 grid gap-2">
                  {q.options.map((option) => {
                    const isSelected = answers[q.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAnswers({ ...answers, [q.id]: option.value })}
                        className={cn(
                          "rounded-md border px-4 py-3 text-left text-sm transition",
                          isSelected
                            ? "border-[var(--accent)] bg-[var(--card)] ring-1 ring-[var(--accent)]"
                            : "border-[var(--border)] hover:bg-[var(--card)]"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("review")} disabled={isPending}>
          戻る
        </Button>
        <Button onClick={save} disabled={isPending} size="lg">
          {isPending || step === "saving" ? "保存中..." : "完了してダッシュボードへ"}
        </Button>
      </div>
    </section>
  );
}

function splitList(value: string): string[] {
  return value
    .split(/[,、,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}
