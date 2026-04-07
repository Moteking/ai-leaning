"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, MessageCircle, Handshake } from "lucide-react";

type Stats = {
  totalAffiliators: number;
  sentCount: number;
  replyRate: number;
  contractRate: number;
};

export function StatsPanel({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "総アフィリエイター",
      value: stats.totalAffiliators.toLocaleString(),
      icon: Users,
      color: "text-[#00f0ff]",
      bgColor: "bg-[#00f0ff]/10",
    },
    {
      label: "送信済みDM",
      value: stats.sentCount.toLocaleString(),
      icon: Send,
      color: "text-[#ff6bff]",
      bgColor: "bg-[#ff6bff]/10",
    },
    {
      label: "返信率",
      value: `${stats.replyRate.toFixed(1)}%`,
      icon: MessageCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "契約率",
      value: `${stats.contractRate.toFixed(1)}%`,
      icon: Handshake,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
