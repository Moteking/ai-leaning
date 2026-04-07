"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, Send, RefreshCw, Loader2 } from "lucide-react";

type Props = {
  affiliatorId: string;
  onSent?: () => void;
};

export function DMComposer({ affiliatorId, onSent }: Props) {
  const [campaignType, setCampaignType] = useState("collab");
  const [product, setProduct] = useState("");
  const [commission, setCommission] = useState("");
  const [tone, setTone] = useState("friendly");
  const [content, setContent] = useState("");
  const [dmId, setDmId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generate = async () => {
    if (!product) return;
    setIsGenerating(true);
    setContent("");
    setDmId(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/dm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliatorId,
          campaignType,
          product,
          commission: commission || undefined,
          tone,
        }),
        signal: abortRef.current.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6));
          if (data.dmId) setDmId(data.dmId);
          if (data.text) setContent((prev) => prev + data.text);
          if (data.error) throw new Error(data.error);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const markAsSent = async () => {
    if (!dmId) return;
    setIsSending(true);
    try {
      await fetch("/api/dm/history", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dmId, status: "sent", content }),
      });
      onSent?.();
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-base">案件情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>案件種別</Label>
              <Select value={campaignType} onValueChange={(v) => v && setCampaignType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collab">コラボ提案</SelectItem>
                  <SelectItem value="review">商品レビュー</SelectItem>
                  <SelectItem value="affiliate">アフィリエイト</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>トーン</Label>
              <Select value={tone} onValueChange={(v) => v && setTone(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">フレンドリー</SelectItem>
                  <SelectItem value="formal">フォーマル</SelectItem>
                  <SelectItem value="casual">カジュアル</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>商品/サービス名</Label>
            <Input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="例: スキンケアセット「グロウプロ」"
            />
          </div>
          <div className="space-y-2">
            <Label>報酬条件（任意）</Label>
            <Input
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              placeholder="例: 売上の15% + 商品提供"
            />
          </div>
          <Button
            onClick={generate}
            disabled={!product || isGenerating}
            className="w-full bg-gradient-to-r from-[#00f0ff] to-[#ff6bff] text-black font-semibold hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI DM生成
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(content || isGenerating) && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-base">生成されたDM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none bg-black/30 border-white/10"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generate}
                disabled={isGenerating || !product}
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                再生成
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!content}
              >
                <Copy className="mr-1 h-3 w-3" />
                {copied ? "コピー済み" : "コピー"}
              </Button>
              <Button
                size="sm"
                onClick={markAsSent}
                disabled={!dmId || isSending || !content}
                className="ml-auto bg-green-600 hover:bg-green-700"
              >
                {isSending ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Send className="mr-1 h-3 w-3" />
                )}
                送信済みにする
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
