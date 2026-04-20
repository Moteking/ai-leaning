"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type WorkStyle = "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE";

const WORK_STYLE_OPTIONS: { value: WorkStyle; label: string }[] = [
  { value: "REMOTE", label: "フルリモート" },
  { value: "HYBRID", label: "ハイブリッド" },
  { value: "ONSITE", label: "フル出社" },
  { value: "FLEXIBLE", label: "柔軟" },
];

export function CandidateProfileForm({
  initial,
}: {
  initial: {
    displayName: string;
    currentPosition: string;
    yearsOfExperience: number;
    skills: string[];
    desiredRoles: string[];
    workStyle: WorkStyle;
    desiredSalaryMin: number | null;
    desiredSalaryMax: number | null;
    resumeText: string;
  };
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [currentPosition, setCurrentPosition] = useState(initial.currentPosition);
  const [yoe, setYoe] = useState(initial.yearsOfExperience.toString());
  const [skills, setSkills] = useState(initial.skills.join(", "));
  const [desiredRoles, setDesiredRoles] = useState(initial.desiredRoles.join(", "));
  const [workStyle, setWorkStyle] = useState<WorkStyle>(initial.workStyle);
  const [salaryMin, setSalaryMin] = useState(initial.desiredSalaryMin?.toString() ?? "");
  const [salaryMax, setSalaryMax] = useState(initial.desiredSalaryMax?.toString() ?? "");
  const [resumeText, setResumeText] = useState(initial.resumeText);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          currentPosition: currentPosition || null,
          yearsOfExperience: Number(yoe) || 0,
          skills: splitList(skills),
          desiredRoles: splitList(desiredRoles),
          workStyle,
          desiredSalaryMin: salaryMin === "" ? null : Number(salaryMin),
          desiredSalaryMax: salaryMax === "" ? null : Number(salaryMax),
          resumeText,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "保存に失敗しました。");
        return;
      }
      setMessage("保存しました。");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="py-6 space-y-5">
        <CardTitle>基本情報</CardTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="displayName">氏名</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="currentPosition">現職</Label>
            <Input
              id="currentPosition"
              value={currentPosition}
              onChange={(e) => setCurrentPosition(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="yoe">経験年数</Label>
            <Input id="yoe" type="number" min={0} max={60} value={yoe} onChange={(e) => setYoe(e.target.value)} />
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
          <div className="md:col-span-2">
            <Label htmlFor="skills">スキル (カンマ区切り)</Label>
            <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desiredRoles">希望職種 (カンマ区切り)</Label>
            <Input id="desiredRoles" value={desiredRoles} onChange={(e) => setDesiredRoles(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="salaryMin">希望年収下限 (万円)</Label>
            <Input
              id="salaryMin"
              type="number"
              min={0}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="salaryMax">希望年収上限 (万円)</Label>
            <Input
              id="salaryMax"
              type="number"
              min={0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="resume">職務経歴書 (テキスト)</Label>
            <Textarea id="resume" rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-[var(--accent)]">{message}</p>}
        <div className="flex justify-end">
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "保存中..." : "保存"}
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
