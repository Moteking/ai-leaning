"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

const SIZE_OPTIONS = [
  { value: "STARTUP", label: "スタートアップ (〜50名)" },
  { value: "SMB", label: "中小 (50〜300名)" },
  { value: "MID_MARKET", label: "中堅 (300〜1000名)" },
  { value: "ENTERPRISE", label: "大企業 (1000名超)" },
];

export function CompanyOnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState<string>("SMB");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || !industry.trim() || description.trim().length < 30) {
      setError("会社名・業種・会社説明 (30文字以上) を入力してください。");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/onboarding/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industry,
          size,
          websiteUrl: websiteUrl.trim() || null,
          description,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "登録に失敗しました。");
        return;
      }
      router.push("/company/dashboard");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="py-6">
        <CardTitle>会社の基本情報</CardTitle>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">会社名</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 株式会社サンプル" />
          </div>
          <div>
            <Label htmlFor="industry">業種</Label>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="例: SaaS" />
          </div>
          <div>
            <Label htmlFor="size">規模</Label>
            <Select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
              {SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="website">コーポレートサイト (任意)</Label>
            <Input
              id="website"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">会社紹介 / プロダクト</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="ミッション、事業内容、プロダクトの特徴、カルチャーなどを記述してください。マッチングに利用されます。"
            />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end">
          <Button onClick={submit} disabled={isPending} size="lg">
            {isPending ? "登録中..." : "登録してダッシュボードへ"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
