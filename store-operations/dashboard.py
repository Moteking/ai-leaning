"""
ワールドスポーツ 店舗運営改善 統合ダッシュボード
全モジュールを統合し、店舗単位の運用改善を一元管理
"""

from datetime import datetime, date, timedelta
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from models.base import (
    PromotionType, CouponType, MemberTier, ShelfZone, PDCACycle,
    Store, SKU, Member, SalesTransaction, LossRecord
)
from promotions.promotion_manager import PromotionManager
from analytics.loss_analysis import LossAnalyzer, PDCAManager
from planogram.planogram_optimizer import PlanogramOptimizer


class StoreOperationsDashboard:
    """店舗運営改善 統合ダッシュボード"""

    def __init__(self):
        self.promotion_mgr = PromotionManager()
        self.loss_analyzer = LossAnalyzer()
        self.pdca_mgr = PDCAManager()
        self.planogram_opt = PlanogramOptimizer()
        self.stores: dict[str, Store] = {}
        self.members: list[Member] = []

    def register_store(self, store: Store):
        """店舗を登録"""
        self.stores[store.store_id] = store

    def register_member(self, member: Member):
        """会員を登録"""
        self.members.append(member)

    def register_sku(self, sku: SKU):
        """SKUを登録"""
        self.planogram_opt.skus[sku.sku_id] = sku

    def record_transaction(self, txn: SalesTransaction):
        """売上トランザクションを記録"""
        self.promotion_mgr.transactions.append(txn)
        self.loss_analyzer.transactions.append(txn)
        self.planogram_opt.transactions.append(txn)

    def generate_store_report(self, store_id: str, period_start: date, period_end: date) -> dict:
        """店舗別総合レポートを生成"""
        store = self.stores.get(store_id)
        if not store:
            return {"error": f"店舗 {store_id} が見つかりません"}

        # 各モジュールからデータ収集
        promo_summary = self.promotion_mgr.get_promotion_summary(store_id)
        loss_analysis = self.loss_analyzer.calculate_loss_rate(store_id, period_start, period_end)
        loss_trend = self.loss_analyzer.analyze_loss_trend(store_id, months=6)
        high_loss_skus = self.loss_analyzer.identify_high_loss_skus(store_id, period_start, period_end)
        golden_zone = self.planogram_opt.analyze_golden_zone(store_id)
        scorecard = self.pdca_mgr.get_improvement_scorecard(store_id)
        zone_perf = self.planogram_opt.get_zone_performance_summary(store_id, period_start, period_end)

        return {
            "report_title": f"ワールドスポーツ {store.store_name} 店舗運営レポート",
            "store": {
                "store_id": store.store_id,
                "store_name": store.store_name,
                "region": store.region,
                "floor_area_sqm": store.floor_area_sqm,
            },
            "period": f"{period_start} ~ {period_end}",
            "generated_at": datetime.now().isoformat(),
            "sections": {
                "1_promotion_overview": promo_summary,
                "2_loss_analysis": loss_analysis,
                "3_loss_trend": loss_trend,
                "4_high_loss_skus": high_loss_skus,
                "5_golden_zone_analysis": golden_zone,
                "6_zone_performance": zone_perf,
                "7_pdca_scorecard": scorecard,
            },
            "executive_summary": self._generate_executive_summary(
                promo_summary, loss_analysis, golden_zone, scorecard
            ),
        }

    def _generate_executive_summary(
        self,
        promo: dict,
        loss: dict,
        golden: dict,
        scorecard: dict
    ) -> dict:
        """エグゼクティブサマリーを生成"""
        issues = []
        actions = []

        # ロス率チェック
        if loss.get("loss_rate_pct", 0) > 2.0:
            issues.append(f"ロス率 {loss['loss_rate_pct']}% - 業界平均(2%)を超過")
            actions.append("ロス率改善のためのPDCAサイクル開始を推奨")

        # プロモーション過多チェック
        risk_alerts = promo.get("risk_alerts", [])
        if risk_alerts:
            issues.extend(risk_alerts)

        # ゴールデンゾーン最適化チェック
        opt_score = golden.get("optimization_score", 100)
        if opt_score < 70:
            issues.append(f"プラノグラム最適化スコア {opt_score}/100 - 棚割改善が必要")
            actions.extend(golden.get("recommendations", []))

        # PDCA達成率チェック
        achievement = scorecard.get("avg_achievement_rate", 0)
        if scorecard.get("total_cycles", 0) > 0 and achievement < 80:
            issues.append(f"PDCA目標達成率 {achievement}% - 改善施策の見直しが必要")

        return {
            "health_score": self._calculate_health_score(loss, golden, scorecard),
            "critical_issues": issues,
            "recommended_actions": actions,
            "overall_assessment": "改善が必要" if issues else "良好",
        }

    def _calculate_health_score(self, loss: dict, golden: dict, scorecard: dict) -> int:
        """店舗ヘルススコア (0-100)"""
        score = 100

        # ロス率によるペナルティ
        loss_rate = loss.get("loss_rate_pct", 0)
        if loss_rate > 3.0:
            score -= 30
        elif loss_rate > 2.0:
            score -= 15
        elif loss_rate > 1.5:
            score -= 5

        # プラノグラム最適化
        opt_score = golden.get("optimization_score", 100)
        score -= max(0, (100 - opt_score) // 3)

        # PDCA達成率
        if scorecard.get("total_cycles", 0) > 0:
            achievement = scorecard.get("avg_achievement_rate", 0)
            if achievement < 50:
                score -= 20
            elif achievement < 80:
                score -= 10

        return max(0, min(100, score))


def run_demo():
    """デモ実行 - サンプルデータで全機能を動作確認"""
    print("=" * 70)
    print("  ワールドスポーツ 店舗運営改善システム デモ")
    print("=" * 70)

    dashboard = StoreOperationsDashboard()

    # --- 店舗登録 ---
    store = Store(
        store_id="ST-001",
        store_name="福岡天神店",
        region="九州",
        address="福岡市中央区天神1-1-1",
        floor_area_sqm=500.0,
        shelf_count=30,
        opening_date=date(2015, 4, 1),
        manager_name="田中太郎",
    )
    dashboard.register_store(store)

    # --- SKU登録 ---
    skus = [
        SKU("SKU-001", "ランニングシューズ Pro", "シューズ", "ランニング", "ナイキ",
            8000, 15000, 50, "26.0", "ブラック", "ナイキジャパン", 14),
        SKU("SKU-002", "トレーニングウェア DRI-FIT", "ウェア", "トレーニング", "ナイキ",
            3000, 6500, 80, "M", "ネイビー", "ナイキジャパン", 14),
        SKU("SKU-003", "サッカーボール 5号球", "用品", "サッカー", "アディダス",
            2000, 4500, 30, "5号", "ホワイト", "アディダスジャパン", 7),
        SKU("SKU-004", "ゴルフクラブ ドライバー", "ゴルフ", "クラブ", "テーラーメイド",
            25000, 55000, 15, "-", "シルバー", "テーラーメイドジャパン", 21),
        SKU("SKU-005", "ヨガマット プレミアム", "フィットネス", "ヨガ", "マンドゥカ",
            4000, 8500, 25, "-", "パープル", "マンドゥカジャパン", 10),
        SKU("SKU-006", "バスケットボールシューズ AIR", "シューズ", "バスケ", "ナイキ",
            10000, 22000, 20, "27.0", "レッド", "ナイキジャパン", 14),
        SKU("SKU-007", "テニスラケット PRO STAFF", "用品", "テニス", "ウィルソン",
            12000, 28000, 10, "-", "ブラック", "ウィルソンジャパン", 14),
    ]
    for sku in skus:
        dashboard.register_sku(sku)

    # --- 会員登録 ---
    members = [
        Member("MEM-001", "鈴木一郎", "suzuki@email.com", "090-1234-5678",
               date(1960, 4, 15), 66, MemberTier.GOLD, date(2018, 1, 1), 15000, 350000, "ST-001"),
        Member("MEM-002", "佐藤花子", "sato@email.com", "090-2345-6789",
               date(1990, 7, 20), 35, MemberTier.SILVER, date(2020, 6, 1), 5000, 120000, "ST-001"),
        Member("MEM-003", "田中次郎", "tanaka@email.com", "090-3456-7890",
               date(1955, 12, 3), 70, MemberTier.PLATINUM, date(2016, 3, 15), 30000, 800000, "ST-001"),
        Member("MEM-004", "高橋美咲", "takahashi@email.com", "090-4567-8901",
               date(2000, 4, 8), 26, MemberTier.REGULAR, date(2026, 4, 1), 0, 0, "ST-001"),
    ]
    for m in members:
        dashboard.register_member(m)

    print("\n【1】プロモーション管理")
    print("-" * 50)

    pm = dashboard.promotion_mgr

    # セール価格設定
    sale = pm.create_sale_price(
        sku=skus[0],
        store_id="ST-001",
        sale_price=11000,
        start_date=datetime(2026, 4, 1),
        end_date=datetime(2026, 4, 30),
        reason="スプリングセール",
    )
    print(f"  セール設定: {skus[0].product_name} ¥{skus[0].retail_price:,} → ¥{sale.sale_price:,} ({sale.discount_rate}%OFF)")

    impact = pm.calculate_sale_impact(sale)
    print(f"  損益分岐増加率: {impact['break_even_increase_pct']}%")

    # ポイント10倍キャンペーン
    point_camp = pm.create_point_multiplier(
        store_id="ST-001",
        campaign_multiplier=10.0,
        start_date=datetime(2026, 4, 1),
        end_date=datetime(2026, 4, 7),
        target_category="シューズ",
    )
    print(f"\n  ポイント10倍キャンペーン: シューズカテゴリ ({point_camp.start_date.strftime('%m/%d')}~{point_camp.end_date.strftime('%m/%d')})")

    # ポイント計算テスト
    points_result = pm.calculate_points(
        purchase_amount=11000,
        store_id="ST-001",
        member=members[0],
        category="シューズ",
        at_time=datetime(2026, 4, 3),
    )
    print(f"  ポイント計算例: ¥11,000購入 → {points_result['earned_points']:,}pt（{points_result['multiplier']}倍）")

    # クーポン作成
    coupon = pm.create_coupon(
        coupon_type=CouponType.PERCENT_DISCOUNT,
        discount_value=15,
        start_date=datetime(2026, 4, 1),
        end_date=datetime(2026, 4, 30),
        target_category="ウェア",
        min_purchase=5000,
    )
    print(f"\n  クーポン作成: ウェアカテゴリ 15%OFF（最低購入¥5,000）")

    # 誕生日クーポン発行（60歳以上シニア）
    bd_coupon = pm.issue_birthday_coupon(member=members[0], discount_value=500, senior_special_discount=1000)
    print(f"\n  誕生日クーポン発行: {members[0].name}様 (66歳・シニア特別) → ¥{bd_coupon.special_discount_value:,}割引")

    # 新規会員ボーナス
    nm_bonus = pm.issue_new_member_bonus(member=members[3], bonus_points=500, welcome_coupon_value=300)
    print(f"  新規会員ボーナス: {members[3].name}様 → {nm_bonus.bonus_points}pt + ¥{300}クーポン")

    # プロモーションサマリー
    summary = pm.get_promotion_summary("ST-001")
    print(f"\n  施策サマリー: セール{summary['active_promotions']['sale_prices']}件, "
          f"ポイント{summary['active_promotions']['point_campaigns']}件, "
          f"クーポン{summary['active_promotions']['active_coupons']}件")
    for alert in summary.get("risk_alerts", []):
        print(f"  {alert}")

    # --- 売上・ロスデータ投入 ---
    print("\n【2】ロス率分析・PDCA")
    print("-" * 50)

    # サンプルトランザクション
    sample_txns = [
        SalesTransaction("TXN-001", "ST-001", "MEM-001", "SKU-001", 1, 11000, 11000, 4000, 11000, 0, None, sale.sale_id, datetime(2026, 4, 3, 10, 30)),
        SalesTransaction("TXN-002", "ST-001", "MEM-002", "SKU-002", 2, 6500, 13000, 0, 1300, 0, None, None, datetime(2026, 4, 3, 14, 0)),
        SalesTransaction("TXN-003", "ST-001", "MEM-003", "SKU-004", 1, 55000, 55000, 0, 5500, 0, None, None, datetime(2026, 4, 4, 11, 0)),
        SalesTransaction("TXN-004", "ST-001", None, "SKU-003", 3, 4500, 13500, 0, 0, 0, None, None, datetime(2026, 4, 4, 16, 0)),
        SalesTransaction("TXN-005", "ST-001", "MEM-001", "SKU-006", 1, 22000, 22000, 0, 22000, 0, None, None, datetime(2026, 4, 5, 13, 0)),
    ]
    for txn in sample_txns:
        dashboard.record_transaction(txn)

    # ロスデータ
    la = dashboard.loss_analyzer
    la.record_loss("ST-001", "SKU-003", "棚卸ロス", 2, 9000, "在庫差異")
    la.record_loss("ST-001", "SKU-002", "値引ロス", 5, 16250, "シーズン終了値引")
    la.record_loss("ST-001", "SKU-005", "廃棄ロス", 1, 8500, "商品破損")

    loss_result = la.calculate_loss_rate("ST-001", date(2026, 4, 1), date(2026, 4, 30))
    print(f"  ロス率: {loss_result['loss_rate_pct']}% ({loss_result['severity']})")
    print(f"  総売上: ¥{loss_result['total_sales']:,.0f}")
    print(f"  総ロス: ¥{loss_result['total_loss']:,.0f}")
    print(f"  ロス種別:")
    for lt, data in loss_result["loss_by_type"].items():
        print(f"    {lt}: {data['count']}個 ¥{data['amount']:,.0f}")

    high_loss = la.identify_high_loss_skus("ST-001", date(2026, 4, 1), date(2026, 4, 30))
    if high_loss:
        print(f"\n  ロス上位SKU:")
        for item in high_loss:
            print(f"    {item['rank']}. {item['sku_id']} - ¥{item['total_amount']:,.0f} (原因: {item['primary_cause']})")

    # PDCA実行
    pdca = dashboard.pdca_mgr
    plan = pdca.create_plan(
        store_id="ST-001",
        promotion_id=sale.sale_id,
        description="スプリングセール シューズカテゴリ 値引施策",
        target_kpi="ロス率",
        target_value=1.5,
        action_items=[
            "値引率を30%以下に制限",
            "在庫回転率の低いSKUを優先的にセール対象に",
            "セール期間中の日次在庫モニタリング実施",
        ],
    )
    pdca.record_execution("ST-001", sale.sale_id, "スプリングセール開始", "ロス率", 1.5)
    check = pdca.evaluate_results("ST-001", sale.sale_id, loss_result["loss_rate_pct"], "ロス率が目標を上回っている")
    pdca.define_improvements("ST-001", sale.sale_id, "次回施策の改善", [
        "値引率を25%以下に引き下げ",
        "セール対象SKUを在庫過多品に限定",
        "ポイント施策との併用を制限",
    ])

    scorecard = pdca.get_improvement_scorecard("ST-001")
    print(f"\n  PDCAスコアカード:")
    print(f"    サイクル数: {scorecard['total_cycles']}")
    print(f"    目標達成率: {scorecard['avg_achievement_rate']}%")
    print(f"    次のアクション: {scorecard['next_action']}")

    # --- プラノグラム ---
    print("\n【3】プラノグラム（棚割）最適化")
    print("-" * 50)

    po = dashboard.planogram_opt

    # 什器登録
    fixture = po.register_fixture(
        store_id="ST-001",
        fixture_type="ゴンドラ",
        location="入口正面A列",
        width_cm=180,
        height_cm=200,
        depth_cm=45,
        shelf_count=5,
    )

    # 棚割設定
    allocations_data = [
        (fixture.fixture_id, "SKU-004", ShelfZone.GOLDEN, 2, 1, 3),   # ゴルフクラブ → ゴールデン
        (fixture.fixture_id, "SKU-006", ShelfZone.GOLDEN, 3, 2, 3),   # バスケシューズ → ゴールデン
        (fixture.fixture_id, "SKU-001", ShelfZone.MIDDLE, 4, 1, 2),   # ランニングシューズ → 中段
        (fixture.fixture_id, "SKU-007", ShelfZone.LOWER, 2, 1, 1),    # テニスラケット → 下段 ※高単価なのにもったいない
        (fixture.fixture_id, "SKU-002", ShelfZone.UPPER, 3, 1, 4),    # ウェア → 上段
        (fixture.fixture_id, "SKU-003", ShelfZone.LOWER, 4, 2, 1),    # サッカーボール → 下段
        (fixture.fixture_id, "SKU-005", ShelfZone.MIDDLE, 3, 2, 2),   # ヨガマット → 中段
    ]
    for data in allocations_data:
        po.allocate_shelf(*data)

    # ゴールデンゾーン分析
    golden_analysis = po.analyze_golden_zone("ST-001")
    print(f"  ゴールデンゾーン配置: {golden_analysis['golden_zone_products']}商品")
    print(f"  平均単価: ¥{golden_analysis['golden_zone_avg_price']:,.0f}")
    print(f"  最適化スコア: {golden_analysis['optimization_score']}/100")
    for rec in golden_analysis["recommendations"]:
        print(f"  → {rec}")

    # 棚割再配置提案
    realloc = po.suggest_reallocation("ST-001", date(2026, 4, 1), date(2026, 4, 30))
    print(f"\n  棚割改善提案: {realloc['total_suggestions']}件")
    print(f"  {realloc['summary']}")
    for s in realloc["suggestions"][:3]:
        print(f"    入替: {s['promote']['product']}({s['promote']['from_zone']}→ゴールデン) "
              f"⇔ {s['demote']['product']}(ゴールデン→{s['demote']['to_zone']})")

    # --- 総合レポート ---
    print("\n【4】店舗総合レポート")
    print("-" * 50)

    report = dashboard.generate_store_report("ST-001", date(2026, 4, 1), date(2026, 4, 30))
    summary = report["executive_summary"]
    print(f"  ヘルススコア: {summary['health_score']}/100")
    print(f"  総合評価: {summary['overall_assessment']}")
    if summary["critical_issues"]:
        print(f"  課題:")
        for issue in summary["critical_issues"]:
            print(f"    • {issue}")
    if summary["recommended_actions"]:
        print(f"  推奨アクション:")
        for action in summary["recommended_actions"]:
            print(f"    • {action}")

    print("\n" + "=" * 70)
    print("  デモ完了")
    print("=" * 70)

    return report


if __name__ == "__main__":
    run_demo()
