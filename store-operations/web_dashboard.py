"""
ワールドスポーツ 店舗運営改善システム - Webダッシュボード
ローカルHTTPサーバーでブラウザから閲覧可能
"""

import http.server
import os
import sys
from string import Template
from datetime import datetime

sys.path.insert(0, os.path.dirname(__file__))

PORT = 8080

HTML_TEMPLATE = Template("""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ワールドスポーツ 店舗運営改善ダッシュボード</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', 'Hiragino Sans', 'Meiryo', sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
.header { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 24px 32px; border-bottom: 2px solid #334155; }
.header h1 { font-size: 24px; font-weight: 700; color: #60a5fa; }
.header .subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
.health-bar { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
.health-score { font-size: 48px; font-weight: 800; }
.health-score.good { color: #22c55e; }
.health-score.warn { color: #f59e0b; }
.health-score.bad { color: #ef4444; }
.health-label { font-size: 14px; color: #94a3b8; }
.health-assessment { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.health-assessment.good { background: #14532d; color: #22c55e; }
.health-assessment.bad { background: #450a0a; color: #ef4444; }
.container { max-width: 1400px; margin: 0 auto; padding: 24px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; }
.card { background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
.card h2 { font-size: 16px; font-weight: 600; color: #60a5fa; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
.card h3 { font-size: 14px; font-weight: 600; color: #cbd5e1; margin: 12px 0 8px; }
.stat-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #1e293b; }
.stat-label { color: #94a3b8; font-size: 13px; }
.stat-value { font-weight: 600; font-size: 14px; }
.stat-value.danger { color: #ef4444; }
.stat-value.warn { color: #f59e0b; }
.stat-value.ok { color: #22c55e; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; padding: 8px; background: #0f172a; color: #94a3b8; font-weight: 600; }
td { padding: 8px; border-bottom: 1px solid #334155; }
tr:hover td { background: #334155; }
.badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.badge-danger { background: #450a0a; color: #ef4444; }
.badge-warn { background: #451a03; color: #f59e0b; }
.badge-ok { background: #14532d; color: #22c55e; }
.badge-info { background: #172554; color: #60a5fa; }
.badge-purple { background: #3b0764; color: #c084fc; }
.alert { padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; }
.alert-danger { background: #450a0a; border-left: 3px solid #ef4444; color: #fca5a5; }
.alert-warn { background: #451a03; border-left: 3px solid #f59e0b; color: #fde68a; }
.alert-info { background: #172554; border-left: 3px solid #60a5fa; color: #93c5fd; }
.progress-bar { height: 8px; background: #334155; border-radius: 4px; overflow: hidden; margin-top: 4px; }
.progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
.progress-fill.green { background: linear-gradient(90deg, #22c55e, #16a34a); }
.progress-fill.yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }
.progress-fill.red { background: linear-gradient(90deg, #ef4444, #dc2626); }
.shelf-visual { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: 8px; }
.shelf-item { padding: 8px; border-radius: 6px; font-size: 11px; text-align: center; }
.shelf-golden { background: linear-gradient(135deg, #854d0e, #a16207); color: #fef3c7; }
.shelf-upper { background: #1e3a5f; color: #93c5fd; }
.shelf-middle { background: #334155; color: #e2e8f0; }
.shelf-lower { background: #1e293b; color: #94a3b8; border: 1px solid #334155; }
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.kpi-card { background: #1e293b; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #334155; }
.kpi-card .value { font-size: 28px; font-weight: 800; margin: 4px 0; }
.kpi-card .label { font-size: 12px; color: #94a3b8; }
.pdca-flow { display: flex; gap: 8px; margin-top: 8px; }
.pdca-step { flex: 1; text-align: center; padding: 10px 6px; border-radius: 8px; font-size: 12px; }
.pdca-plan { background: #172554; color: #60a5fa; }
.pdca-do { background: #14532d; color: #22c55e; }
.pdca-check { background: #451a03; color: #f59e0b; }
.pdca-act { background: #3b0764; color: #c084fc; }
.full-width { grid-column: 1 / -1; }
</style>
</head>
<body>

<div class="header">
  <h1>WORLD SPORTS - 店舗運営改善ダッシュボード</h1>
  <div class="subtitle">福岡天神店 (ST-001) | 売場面積 500㎡ | 什器30台 | レポート期間: 2026年4月</div>
  <div class="health-bar">
    <div>
      <div class="health-score $health_class">$health_score</div>
      <div class="health-label">ヘルススコア / 100</div>
    </div>
    <div>
      <div class="health-assessment $assess_class">$assessment</div>
    </div>
  </div>
</div>

<div class="container">

<div class="kpi-grid">
  <div class="kpi-card">
    <div class="label">総売上</div>
    <div class="value" style="color:#60a5fa">¥$total_sales</div>
    <div class="label">2026年4月</div>
  </div>
  <div class="kpi-card">
    <div class="label">ロス率</div>
    <div class="value" style="color:$loss_color">$loss_rate%</div>
    <div class="label">業界平均: 2.0%</div>
  </div>
  <div class="kpi-card">
    <div class="label">実施中施策</div>
    <div class="value" style="color:#c084fc">$active_promos</div>
    <div class="label">セール+ポイント+クーポン</div>
  </div>
  <div class="kpi-card">
    <div class="label">棚割最適化</div>
    <div class="value" style="color:$opt_color">$opt_score/100</div>
    <div class="label">ゴールデンゾーン配置</div>
  </div>
</div>

<div class="grid">

<!-- 課題・アラート -->
<div class="card full-width">
  <h2>課題・リスクアラート</h2>
  $alerts_html
</div>

<!-- プロモーション管理 -->
<div class="card">
  <h2>プロモーション施策一覧</h2>
  <h3>セール価格</h3>
  <table>
    <tr><th>商品</th><th>定価</th><th>セール価格</th><th>値引率</th></tr>
    <tr><td>ランニングシューズ Pro</td><td>¥15,000</td><td style="color:#22c55e">¥11,000</td><td><span class="badge badge-warn">26.7%OFF</span></td></tr>
  </table>
  <div class="stat-row" style="margin-top:12px"><span class="stat-label">損益分岐増加率</span><span class="stat-value warn">36.4%</span></div>

  <h3>ポイントキャンペーン</h3>
  <table>
    <tr><th>対象</th><th>倍率</th><th>期間</th></tr>
    <tr><td>シューズカテゴリ</td><td><span class="badge badge-danger">10倍</span></td><td>4/1〜4/7</td></tr>
  </table>
  <div class="stat-row" style="margin-top:8px"><span class="stat-label">¥11,000購入時の付与ポイント</span><span class="stat-value" style="color:#c084fc">110,000pt</span></div>

  <h3>クーポン</h3>
  <table>
    <tr><th>種別</th><th>内容</th><th>対象</th></tr>
    <tr><td><span class="badge badge-info">定率</span></td><td>15%OFF</td><td>ウェアカテゴリ (最低¥5,000)</td></tr>
    <tr><td><span class="badge badge-purple">誕生日</span></td><td>¥1,000引</td><td>鈴木一郎様 (66歳シニア特別)</td></tr>
    <tr><td><span class="badge badge-ok">新規</span></td><td>500pt + ¥300引</td><td>高橋美咲様 (新規会員)</td></tr>
  </table>
</div>

<!-- ロス率分析 -->
<div class="card">
  <h2>ロス率分析</h2>
  <div class="stat-row"><span class="stat-label">総売上</span><span class="stat-value">¥$total_sales</span></div>
  <div class="stat-row"><span class="stat-label">総ロス金額</span><span class="stat-value danger">¥$total_loss</span></div>
  <div class="stat-row"><span class="stat-label">ロス率</span><span class="stat-value danger">$loss_rate%</span></div>
  <div class="stat-row"><span class="stat-label">判定</span><span class="stat-value"><span class="badge badge-danger">$severity</span></span></div>

  <h3>ロス種別内訳</h3>
  <table>
    <tr><th>種別</th><th>数量</th><th>金額</th><th>構成比</th></tr>
    <tr><td>値引ロス</td><td>5個</td><td style="color:#ef4444">¥16,250</td><td>
      <div class="progress-bar"><div class="progress-fill red" style="width:48%"></div></div>48%
    </td></tr>
    <tr><td>棚卸ロス</td><td>2個</td><td style="color:#f59e0b">¥9,000</td><td>
      <div class="progress-bar"><div class="progress-fill yellow" style="width:27%"></div></div>27%
    </td></tr>
    <tr><td>廃棄ロス</td><td>1個</td><td style="color:#f59e0b">¥8,500</td><td>
      <div class="progress-bar"><div class="progress-fill yellow" style="width:25%"></div></div>25%
    </td></tr>
  </table>

  <h3>ロス上位SKU</h3>
  <table>
    <tr><th>#</th><th>SKU</th><th>金額</th><th>主因</th></tr>
    <tr><td>1</td><td>SKU-002 ウェア DRI-FIT</td><td style="color:#ef4444">¥16,250</td><td><span class="badge badge-warn">シーズン終了値引</span></td></tr>
    <tr><td>2</td><td>SKU-003 サッカーボール</td><td style="color:#f59e0b">¥9,000</td><td><span class="badge badge-danger">在庫差異</span></td></tr>
    <tr><td>3</td><td>SKU-005 ヨガマット</td><td style="color:#f59e0b">¥8,500</td><td><span class="badge badge-info">商品破損</span></td></tr>
  </table>
</div>

<!-- PDCA管理 -->
<div class="card">
  <h2>PDCAサイクル管理</h2>
  <div class="stat-row"><span class="stat-label">対象施策</span><span class="stat-value">スプリングセール シューズカテゴリ</span></div>
  <div class="stat-row"><span class="stat-label">目標KPI</span><span class="stat-value">ロス率 1.5%以下</span></div>
  <div class="stat-row"><span class="stat-label">実績</span><span class="stat-value danger">$loss_rate%</span></div>

  <div class="pdca-flow">
    <div class="pdca-step pdca-plan"><b>Plan</b><br>値引率30%以下<br>日次モニタリング</div>
    <div class="pdca-step pdca-do"><b>Do</b><br>セール開始<br>4/1〜4/30</div>
    <div class="pdca-step pdca-check"><b>Check</b><br>ロス率$loss_rate%<br>目標未達</div>
    <div class="pdca-step pdca-act"><b>Act</b><br>値引率25%以下へ<br>対象SKU限定</div>
  </div>

  <h3 style="margin-top:16px">改善アクション (次サイクル)</h3>
  <div class="alert alert-info">1. 値引率を25%以下に引き下げ</div>
  <div class="alert alert-info">2. セール対象SKUを在庫過多品に限定</div>
  <div class="alert alert-info">3. ポイント施策との併用を制限</div>
</div>

<!-- プラノグラム -->
<div class="card">
  <h2>プラノグラム（棚割）最適化</h2>
  <div class="stat-row"><span class="stat-label">最適化スコア</span><span class="stat-value $opt_val_class">$opt_score/100</span></div>
  <div class="stat-row"><span class="stat-label">ゴールデンゾーン商品数</span><span class="stat-value">2商品</span></div>
  <div class="stat-row"><span class="stat-label">ゴールデンゾーン平均単価</span><span class="stat-value" style="color:#22c55e">¥38,500</span></div>

  <h3>什器 入口正面A列 (ゴンドラ 180x200cm)</h3>
  <div class="shelf-visual">
    <div class="shelf-upper">上段<br><b>ウェア DRI-FIT</b><br>¥6,500 x 3face</div>
    <div class="shelf-upper" style="opacity:0.3"></div>
    <div class="shelf-golden">★ ゴールデン<br><b>ゴルフクラブ ドライバー</b><br>¥55,000 x 2face</div>
    <div class="shelf-golden">★ ゴールデン<br><b>バスケシューズ AIR</b><br>¥22,000 x 3face</div>
    <div class="shelf-middle">中段<br><b>ランニングシューズ Pro</b><br>¥15,000 x 4face</div>
    <div class="shelf-middle">中段<br><b>ヨガマット プレミアム</b><br>¥8,500 x 3face</div>
    <div class="shelf-lower">下段<br><b>テニスラケット PRO STAFF</b><br>¥28,000 x 2face</div>
    <div class="shelf-lower">下段<br><b>サッカーボール 5号球</b><br>¥4,500 x 4face</div>
  </div>

  <h3 style="margin-top:16px">棚割改善の推奨</h3>
  <div class="alert alert-warn">テニスラケット PRO STAFF（¥28,000）が下段に配置 → ゴールデンゾーンへ移動推奨</div>
  <div class="alert alert-warn">ランニングシューズ Pro（¥15,000）が中段に配置 → ゴールデンゾーンへ移動推奨</div>
</div>

<!-- 会員情報 -->
<div class="card">
  <h2>会員・施策対象者</h2>
  <table>
    <tr><th>会員</th><th>年齢</th><th>ランク</th><th>保有pt</th><th>特記</th></tr>
    <tr><td>鈴木一郎</td><td>66歳</td><td><span class="badge badge-warn">ゴールド</span></td><td>15,000pt</td><td><span class="badge badge-purple">シニア / 誕生日4月</span></td></tr>
    <tr><td>佐藤花子</td><td>35歳</td><td><span class="badge badge-info">シルバー</span></td><td>5,000pt</td><td>-</td></tr>
    <tr><td>田中次郎</td><td>70歳</td><td><span class="badge badge-ok">プラチナ</span></td><td>30,000pt</td><td><span class="badge badge-purple">シニア</span></td></tr>
    <tr><td>高橋美咲</td><td>26歳</td><td><span class="badge" style="background:#334155;color:#94a3b8">レギュラー</span></td><td>500pt</td><td><span class="badge badge-ok">新規会員</span></td></tr>
  </table>

  <h3 style="margin-top:16px">今月の誕生日会員</h3>
  <div class="alert alert-info">鈴木一郎様 (4/15) - シニア特別クーポン ¥1,000 発行済み</div>
  <div class="alert alert-info">高橋美咲様 (4/8) - 新規会員ウェルカム 500pt + ¥300クーポン 発行済み</div>
</div>

<!-- 商品マスタ -->
<div class="card">
  <h2>SKUマスタ (登録商品)</h2>
  <table>
    <tr><th>SKU</th><th>商品名</th><th>ブランド</th><th>原価</th><th>定価</th><th>粗利率</th><th>在庫</th></tr>
    <tr><td>SKU-001</td><td>ランニングシューズ Pro</td><td>ナイキ</td><td>¥8,000</td><td>¥15,000</td><td style="color:#22c55e">46.7%</td><td>50</td></tr>
    <tr><td>SKU-002</td><td>ウェア DRI-FIT</td><td>ナイキ</td><td>¥3,000</td><td>¥6,500</td><td style="color:#22c55e">53.8%</td><td>80</td></tr>
    <tr><td>SKU-003</td><td>サッカーボール 5号球</td><td>アディダス</td><td>¥2,000</td><td>¥4,500</td><td style="color:#22c55e">55.6%</td><td>30</td></tr>
    <tr><td>SKU-004</td><td>ゴルフクラブ ドライバー</td><td>テーラーメイド</td><td>¥25,000</td><td>¥55,000</td><td style="color:#22c55e">54.5%</td><td>15</td></tr>
    <tr><td>SKU-005</td><td>ヨガマット プレミアム</td><td>マンドゥカ</td><td>¥4,000</td><td>¥8,500</td><td style="color:#22c55e">52.9%</td><td>25</td></tr>
    <tr><td>SKU-006</td><td>バスケシューズ AIR</td><td>ナイキ</td><td>¥10,000</td><td>¥22,000</td><td style="color:#22c55e">54.5%</td><td>20</td></tr>
    <tr><td>SKU-007</td><td>テニスラケット PRO STAFF</td><td>ウィルソン</td><td>¥12,000</td><td>¥28,000</td><td style="color:#22c55e">57.1%</td><td>10</td></tr>
  </table>
</div>

</div><!-- grid -->

<div style="text-align:center; padding: 32px; color: #475569; font-size: 12px;">
  ワールドスポーツ 店舗運営改善システム v1.0 | Generated: $generated_at
</div>

</div><!-- container -->
</body>
</html>""")


class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()

            health_score = 67
            loss_rate = 29.48
            total_sales = "114,500"
            total_loss = "33,750"
            severity = "危険"
            opt_score = 90
            active_promos = 5

            health_class = "bad" if health_score < 70 else ("warn" if health_score < 85 else "good")
            assess_class = "bad" if health_score < 70 else "good"
            assessment = "改善が必要" if health_score < 70 else "良好"
            loss_color = "#ef4444" if loss_rate > 3.0 else ("#f59e0b" if loss_rate > 2.0 else "#22c55e")
            opt_color = "#22c55e" if opt_score >= 80 else ("#f59e0b" if opt_score >= 60 else "#ef4444")
            opt_val_class = "ok" if opt_score >= 80 else ("warn" if opt_score >= 60 else "danger")

            alerts_html = ""
            alerts_html += '<div class="alert alert-danger">ロス率 29.48% - 業界平均(2%)を大幅超過。在庫管理と発注精度の見直しが急務です</div>'
            alerts_html += '<div class="alert alert-warn">10倍以上のポイント施策が1件実施中。ポイント債務増大に注意してください</div>'
            alerts_html += '<div class="alert alert-warn">高単価商品2点（テニスラケット¥28,000、ランニングシューズ¥15,000）がゴールデンゾーン外に配置</div>'
            alerts_html += '<div class="alert alert-info">PDCAサイクル1巡目完了 → 次サイクルで値引率25%以下への引き下げを推奨</div>'

            html = HTML_TEMPLATE.substitute(
                health_score=health_score,
                health_class=health_class,
                assess_class=assess_class,
                assessment=assessment,
                total_sales=total_sales,
                total_loss=total_loss,
                loss_rate=loss_rate,
                loss_color=loss_color,
                severity=severity,
                active_promos=active_promos,
                opt_score=opt_score,
                opt_color=opt_color,
                opt_val_class=opt_val_class,
                alerts_html=alerts_html,
                generated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            )
            self.wfile.write(html.encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass


def main():
    server = http.server.HTTPServer(("0.0.0.0", PORT), DashboardHandler)
    print(f"ワールドスポーツ 店舗運営改善ダッシュボード起動中...")
    print(f"URL: http://localhost:{PORT}")
    print("停止: Ctrl+C")
    server.serve_forever()


if __name__ == "__main__":
    main()
