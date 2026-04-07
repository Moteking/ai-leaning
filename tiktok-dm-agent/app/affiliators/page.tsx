"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import Papa from "papaparse";

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
  dms: { id: string; status: string }[];
};

const statusLabels: Record<string, string> = {
  new: "新規",
  contacted: "連絡済",
  replied: "返信あり",
  contracted: "契約済",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  replied: "bg-green-500/20 text-green-400",
  contracted: "bg-purple-500/20 text-purple-400",
};

export default function AffiliatorsPage() {
  const [affiliators, setAffiliators] = useState<Affiliator[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nicheFilter, setNicheFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const limit = 20;

  const [form, setForm] = useState({
    tiktokHandle: "",
    name: "",
    followers: "",
    niche: "",
    avgViews: "",
    engageRate: "",
    email: "",
    notes: "",
  });

  const fetchAffiliators = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });
    if (nicheFilter) params.set("niche", nicheFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (minFollowers) params.set("minFollowers", minFollowers);
    if (maxFollowers) params.set("maxFollowers", maxFollowers);

    try {
      const res = await fetch(`/api/affiliators?${params}`);
      const data = await res.json();
      setAffiliators(data.affiliators);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, nicheFilter, statusFilter, minFollowers, maxFollowers]);

  useEffect(() => {
    fetchAffiliators();
  }, [fetchAffiliators]);

  const handleAdd = async () => {
    await fetch("/api/affiliators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        followers: parseInt(form.followers) || 0,
        avgViews: parseInt(form.avgViews) || 0,
        engageRate: parseFloat(form.engageRate) || 0,
        email: form.email || undefined,
        notes: form.notes || undefined,
      }),
    });
    setShowAddDialog(false);
    setForm({
      tiktokHandle: "",
      name: "",
      followers: "",
      niche: "",
      avgViews: "",
      engageRate: "",
      email: "",
      notes: "",
    });
    fetchAffiliators();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    await fetch(`/api/affiliators?id=${id}`, { method: "DELETE" });
    fetchAffiliators();
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const records = (results.data as Record<string, string>[]).map((row) => ({
          tiktokHandle: row.tiktokHandle || row.handle || row["TikTok Handle"] || "",
          name: row.name || row["名前"] || "",
          followers: parseInt(row.followers || row["フォロワー"] || "0") || 0,
          niche: row.niche || row["ジャンル"] || "",
          avgViews: parseInt(row.avgViews || row["平均再生数"] || "0") || 0,
          engageRate: parseFloat(row.engageRate || row["ER"] || "0") || 0,
          email: row.email || row["メール"] || undefined,
          notes: row.notes || row["メモ"] || undefined,
        })).filter((r) => r.tiktokHandle && r.name);

        if (records.length > 0) {
          await fetch("/api/affiliators", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(records),
          });
          fetchAffiliators();
        }
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: () => setImporting(false),
    });
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">アフィリエイター一覧</h2>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleCSVImport}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            CSVインポート
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-10 px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#ff6bff] text-black cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              追加
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-white/10">
              <DialogHeader>
                <DialogTitle>アフィリエイター追加</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TikTokハンドル</Label>
                    <Input
                      value={form.tiktokHandle}
                      onChange={(e) =>
                        setForm({ ...form, tiktokHandle: e.target.value })
                      }
                      placeholder="@username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>名前</Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>フォロワー数</Label>
                    <Input
                      type="number"
                      value={form.followers}
                      onChange={(e) =>
                        setForm({ ...form, followers: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>平均再生数</Label>
                    <Input
                      type="number"
                      value={form.avgViews}
                      onChange={(e) =>
                        setForm({ ...form, avgViews: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ER（%）</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={form.engageRate}
                      onChange={(e) =>
                        setForm({ ...form, engageRate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ジャンル</Label>
                  <Input
                    value={form.niche}
                    onChange={(e) =>
                      setForm({ ...form, niche: e.target.value })
                    }
                    placeholder="例: 美容, ファッション, グルメ"
                  />
                </div>
                <div className="space-y-2">
                  <Label>メール（任意）</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>メモ（任意）</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleAdd} className="w-full">
                  追加する
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-sm">フィルター</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">ジャンル</Label>
              <Input
                placeholder="例: 美容"
                value={nicheFilter}
                onChange={(e) => {
                  setNicheFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ステータス</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v === "all" ? "" : (v ?? ""));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="new">新規</SelectItem>
                  <SelectItem value="contacted">連絡済</SelectItem>
                  <SelectItem value="replied">返信あり</SelectItem>
                  <SelectItem value="contracted">契約済</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">最小フォロワー</Label>
              <Input
                type="number"
                placeholder="0"
                value={minFollowers}
                onChange={(e) => {
                  setMinFollowers(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">最大フォロワー</Label>
              <Input
                type="number"
                placeholder="上限なし"
                value={maxFollowers}
                onChange={(e) => {
                  setMaxFollowers(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-[#00f0ff]" />
            </div>
          ) : affiliators.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>アフィリエイターが見つかりません</p>
              <p className="text-sm mt-1">
                「追加」ボタンまたはCSVインポートで登録してください
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>名前</TableHead>
                    <TableHead>ジャンル</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => toggleSort("followers")}
                    >
                      <span className="flex items-center gap-1">
                        フォロワー
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => toggleSort("avgViews")}
                    >
                      <span className="flex items-center gap-1">
                        平均再生
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => toggleSort("engageRate")}
                    >
                      <span className="flex items-center gap-1">
                        ER
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliators.map((a) => (
                    <TableRow key={a.id} className="border-white/10">
                      <TableCell>
                        <div>
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.tiktokHandle}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {a.niche}
                        </Badge>
                      </TableCell>
                      <TableCell>{a.followers.toLocaleString()}</TableCell>
                      <TableCell>{a.avgViews.toLocaleString()}</TableCell>
                      <TableCell>{a.engageRate}%</TableCell>
                      <TableCell>
                        <Badge className={statusColors[a.status] || ""}>
                          {statusLabels[a.status] || a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/compose/${a.id}`}>
                            <Button size="sm" variant="outline" className="h-8">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              DM作成
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(a.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            全{total}件中 {(page - 1) * limit + 1}-
            {Math.min(page * limit, total)}件
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
