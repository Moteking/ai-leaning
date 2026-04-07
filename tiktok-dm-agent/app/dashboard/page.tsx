"use client";

import { useEffect, useState } from "react";
import { StatsPanel } from "@/components/StatsPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DM = {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  affiliator: { name: string; tiktokHandle: string };
};

type Affiliator = {
  id: string;
  status: string;
  dms: { id: string; status: string }[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAffiliators: 0,
    sentCount: 0,
    replyRate: 0,
    contractRate: 0,
  });
  const [recentDMs, setRecentDMs] = useState<DM[]>([]);
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [affRes, dmRes] = await Promise.all([
          fetch("/api/affiliators?limit=1000"),
          fetch("/api/dm/history?limit=5"),
        ]);
        const affData = await affRes.json();
        const dmData = await dmRes.json();

        const affiliators: Affiliator[] = affData.affiliators || [];
        const total = affiliators.length;
        const statusCounts: Record<string, number> = {
          新規: 0,
          連絡済: 0,
          返信あり: 0,
          契約済: 0,
        };
        const statusMap: Record<string, string> = {
          new: "新規",
          contacted: "連絡済",
          replied: "返信あり",
          contracted: "契約済",
        };

        let sentCount = 0;
        let repliedCount = 0;
        let contractedCount = 0;

        affiliators.forEach((a) => {
          const label = statusMap[a.status] || a.status;
          statusCounts[label] = (statusCounts[label] || 0) + 1;
          if (a.status === "contacted" || a.status === "replied" || a.status === "contracted")
            sentCount++;
          if (a.status === "replied" || a.status === "contracted")
            repliedCount++;
          if (a.status === "contracted") contractedCount++;
        });

        setStats({
          totalAffiliators: total,
          sentCount,
          replyRate: sentCount > 0 ? (repliedCount / sentCount) * 100 : 0,
          contractRate: total > 0 ? (contractedCount / total) * 100 : 0,
        });

        setChartData(
          Object.entries(statusCounts).map(([name, count]) => ({
            name,
            count,
          }))
        );

        setRecentDMs(dmData.dms || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f0ff]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ダッシュボード</h2>

      <StatsPanel stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-base">ステータス分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent DMs */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-base">直近のDM</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDMs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                まだDMがありません
              </p>
            ) : (
              <div className="space-y-3">
                {recentDMs.map((dm) => (
                  <div
                    key={dm.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-black/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {dm.affiliator.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {dm.content.substring(0, 60)}...
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-2 shrink-0 text-xs"
                    >
                      {dm.status === "draft"
                        ? "下書き"
                        : dm.status === "sent"
                          ? "送信済"
                          : "返信あり"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
