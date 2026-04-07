"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, TrendingUp, AtSign } from "lucide-react";

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

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  replied: "bg-green-500/20 text-green-400 border-green-500/30",
  contracted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels: Record<string, string> = {
  new: "新規",
  contacted: "連絡済",
  replied: "返信あり",
  contracted: "契約済",
};

export function AffiliatorCard({ affiliator }: { affiliator: Affiliator }) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{affiliator.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <AtSign className="h-3 w-3" />
              {affiliator.tiktokHandle}
            </p>
          </div>
          <Badge className={statusColors[affiliator.status] || ""}>
            {statusLabels[affiliator.status] || affiliator.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00f0ff]" />
            <div>
              <p className="text-muted-foreground">フォロワー</p>
              <p className="font-semibold">
                {affiliator.followers.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#ff6bff]" />
            <div>
              <p className="text-muted-foreground">平均再生</p>
              <p className="font-semibold">
                {affiliator.avgViews.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <div>
              <p className="text-muted-foreground">ER</p>
              <p className="font-semibold">{affiliator.engageRate}%</p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Badge variant="outline" className="text-xs">
            {affiliator.niche}
          </Badge>
        </div>
        {affiliator.notes && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {affiliator.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
