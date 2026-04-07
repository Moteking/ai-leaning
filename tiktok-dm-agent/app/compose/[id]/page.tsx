"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { AffiliatorCard } from "@/components/AffiliatorCard";
import { DMComposer } from "@/components/DMComposer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

type Affiliator = {
  id: string;
  tiktokHandle: string;
  name: string;
  followers: number;
  niche: string;
  avgViews: number;
  engageRate: number;
  email?: string | null;
  notes?: string | null;
  status: string;
};

type DM = {
  id: string;
  content: string;
  status: string;
  campaignType: string;
  product: string;
  createdAt: string;
  sentAt?: string | null;
};

export default function ComposePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [affiliator, setAffiliator] = useState<Affiliator | null>(null);
  const [history, setHistory] = useState<DM[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [affRes, dmRes] = await Promise.all([
          fetch(`/api/affiliators?limit=1000`),
          fetch(`/api/dm/history?affiliatorId=${id}`),
        ]);
        const affData = await affRes.json();
        const dmData = await dmRes.json();

        const found = affData.affiliators?.find(
          (a: Affiliator) => a.id === id
        );
        setAffiliator(found || null);
        setHistory(dmData.dms || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff]" />
      </div>
    );
  }

  if (!affiliator) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          アフィリエイターが見つかりません
        </p>
        <Link href="/affiliators">
          <Button variant="outline" className="mt-4">
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const campaignLabels: Record<string, string> = {
    collab: "コラボ",
    review: "レビュー",
    affiliate: "アフィリエイト",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/affiliators">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">DM作成</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Affiliator Info */}
        <div className="space-y-6">
          <AffiliatorCard affiliator={affiliator} />

          {/* DM History */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-base">DM履歴</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  まだDMがありません
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((dm) => (
                    <div
                      key={dm.id}
                      className="p-3 rounded-lg bg-black/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {campaignLabels[dm.campaignType] || dm.campaignType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {dm.product}
                          </span>
                        </div>
                        <Badge
                          className={
                            dm.status === "sent"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }
                        >
                          {dm.status === "draft"
                            ? "下書き"
                            : dm.status === "sent"
                              ? "送信済"
                              : "返信あり"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {dm.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(dm.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Composer */}
        <DMComposer
          affiliatorId={id}
          onSent={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}
