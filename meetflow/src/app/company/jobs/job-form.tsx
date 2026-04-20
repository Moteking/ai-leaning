"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type WorkStyle = "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE";
type Status = "ACTIVE" | "PAUSED" | "CLOSED";

const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: "REMOTE", label: "フルリモート" },
  { value: "HYBRID", label: "ハイブリッド" },
  { value: "ONSITE", label: "フル出社" },
  { value: "FLEXIBLE", label: "柔軟" },
];

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "ACTIVE", label: "公開中" },
  { value: "PAUSED", label: "一時停止" },
  { value: "CLOSED", label: "終了" },
];

type Props =
  | { mode: "create" }
  | {
      mode: "edit";
      jobId: string;
      initial: {
        title: string;
        description: string;
        requiredSkills: string[];
        salaryMin: number;
        salaryMax: number;
        workStyle: WorkStyle;
        status: Status;
      };
    };

export function JobForm(props: Props) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.initial : null;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [requiredSkills, setRequiredSkills] = useState(initial?.requiredSkills.join(", ") ?? "");
  const [salaryMin, setSalaryMin] = useState(initial?.salaryMin.toString() ?? "");
  const [salaryMax, setSalaryMax] = useState(initial?.salaryMax.toString() ?? "");
  const [workStyle, setWorkStyle] = useState<WorkStyle>(initial?.workStyle ?? "FLEXIBLE");
  const [status, setStatus] = useState<Status>(initial?.status ?? "ACTIVE");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!title.trim() || description.trim().length < 30) {
      setError("タイトルと求人詳細 (30文字以上) を入力してください。");
      return;
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) {
      setError("年収レンジを正しく設定してください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const url = props.mode === "edit" ? `/api/jobs/${props.jobId}` : "/api/jobs";
      const method = props.mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          requiredSkills: splitList(requiredSkills),
          salaryMin: min,
          salaryMax: max,
          workStyle,
          status,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "保存に失敗しました。");
        return;
      }
      router.push("/company/jobs");
      router.refresh();
    });
  }

  async function remove() {
    if (props.mode !== "edit") return;
    if (!confirm("この求人を削除します。よろしいですか?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/jobs/${props.jobId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "削除に失敗しました。");
        return;
      }
      router.push("/company/jobs");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="py-6 space-y-5">
        <CardTitle>求人情報</CardTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title">職種タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: シニアバックエンドエンジニア"
            />
          </div>
          <div>
            <Label htmlFor="workStyle">勤務スタイル</Label>
            <Select id="workStyle" value={workStyle} onChange={(e) => setWorkStyle(e.target.value as WorkStyle)}>
              {WORK_STYLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">ステータス</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="salaryMin">年収下限 (万円)</Label>
            <Input
              id="salaryMin"
              type="number"
              min={0}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="salaryMax">年収上限 (万円)</Label>
            <Input
              id="salaryMax"
              type="number"
              min={0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="requiredSkills">必要スキル (カンマ区切り)</Label>
            <Input
              id="requiredSkills"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">求人詳細</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              placeholder="ミッション、チーム構成、技術スタック、評価制度、選考フローなど。マッチングに利用されます。"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center justify-between">
          {props.mode === "edit" ? (
            <Button variant="ghost" onClick={remove} disabled={isPending}>
              削除
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "保存中..." : props.mode === "edit" ? "更新" : "作成"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function splitList(value: string): string[] {
  return value
    .split(/[,、,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}
