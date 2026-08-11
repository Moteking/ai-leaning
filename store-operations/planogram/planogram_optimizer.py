"""
ワールドスポーツ プラノグラム（棚割）最適化システム
- 什器・棚の配置管理
- ゴールデンゾーンへの高値商材の最適配置
- 棚割効果測定（フェイス当たり売上、回転率）
- 陳列最適化提案
"""

from datetime import date, datetime, timedelta
from typing import Optional
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.base import (
    ShelfZone, Store, SKU, Fixture,
    ShelfAllocation, PlanogramPerformance, SalesTransaction
)


class PlanogramOptimizer:
    """プラノグラム最適化エンジン"""

    # ゴールデンゾーン定義（目線の高さ）
    GOLDEN_ZONE_HEIGHT_MIN = 120  # cm
    GOLDEN_ZONE_HEIGHT_MAX = 150  # cm

    # ゾーン別の売上ポテンシャル係数
    ZONE_POTENTIAL = {
        ShelfZone.GOLDEN: 1.0,     # 最も売れやすい
        ShelfZone.END_CAP: 0.85,   # エンドキャップも高い注目度
        ShelfZone.MIDDLE: 0.7,
        ShelfZone.UPPER: 0.5,
        ShelfZone.LOWER: 0.4,
        ShelfZone.FLOOR: 0.6,
    }

    def __init__(self):
        self.fixtures: list[Fixture] = []
        self.allocations: list[ShelfAllocation] = []
        self.performances: list[PlanogramPerformance] = []
        self.transactions: list[SalesTransaction] = []
        self.skus: dict[str, SKU] = {}

    def register_fixture(
        self,
        store_id: str,
        fixture_type: str,
        location: str,
        width_cm: float,
        height_cm: float,
        depth_cm: float,
        shelf_count: int,
        max_weight_kg: float = 100.0
    ) -> Fixture:
        """什器を登録"""
        fixture = Fixture(
            fixture_id=f"FIX-{len(self.fixtures) + 1:06d}",
            store_id=store_id,
            fixture_type=fixture_type,
            location=location,
            width_cm=width_cm,
            height_cm=height_cm,
            depth_cm=depth_cm,
            shelf_count=shelf_count,
            max_weight_kg=max_weight_kg,
        )
        self.fixtures.append(fixture)
        return fixture

    def allocate_shelf(
        self,
        fixture_id: str,
        sku_id: str,
        shelf_zone: ShelfZone,
        face_count: int,
        position_x: int,
        position_y: int
    ) -> ShelfAllocation:
        """棚割を設定"""
        # 重複チェック
        existing = [
            a for a in self.allocations
            if a.fixture_id == fixture_id
            and a.position_x == position_x
            and a.position_y == position_y
            and a.is_current
        ]
        if existing:
            for a in existing:
                a.is_current = False

        allocation = ShelfAllocation(
            allocation_id=f"ALLOC-{len(self.allocations) + 1:06d}",
            fixture_id=fixture_id,
            shelf_zone=shelf_zone,
            sku_id=sku_id,
            face_count=face_count,
            position_x=position_x,
            position_y=position_y,
            allocated_date=date.today(),
        )
        self.allocations.append(allocation)
        return allocation

    def get_current_planogram(self, fixture_id: str) -> list[dict]:
        """什器の現在の棚割を取得"""
        current = [
            a for a in self.allocations
            if a.fixture_id == fixture_id and a.is_current
        ]
        current.sort(key=lambda a: (a.position_y, a.position_x))

        return [
            {
                "allocation_id": a.allocation_id,
                "sku_id": a.sku_id,
                "product_name": self.skus[a.sku_id].product_name
                if a.sku_id in self.skus else "不明",
                "zone": a.shelf_zone.value,
                "face_count": a.face_count,
                "position": f"({a.position_x}, {a.position_y})",
                "retail_price": self.skus[a.sku_id].retail_price
                if a.sku_id in self.skus else 0,
            }
            for a in current
        ]

    def analyze_golden_zone(self, store_id: str) -> dict:
        """ゴールデンゾーン配置分析"""
        store_fixtures = [f for f in self.fixtures if f.store_id == store_id]
        fixture_ids = {f.fixture_id for f in store_fixtures}

        golden_allocs = [
            a for a in self.allocations
            if a.fixture_id in fixture_ids
            and a.shelf_zone == ShelfZone.GOLDEN
            and a.is_current
        ]
        all_current_allocs = [
            a for a in self.allocations
            if a.fixture_id in fixture_ids and a.is_current
        ]

        # ゴールデンゾーンの商品分析
        golden_products = []
        misplaced_high_value = []
        misplaced_low_value = []

        for a in golden_allocs:
            sku = self.skus.get(a.sku_id)
            if sku:
                golden_products.append({
                    "sku_id": sku.sku_id,
                    "product_name": sku.product_name,
                    "retail_price": sku.retail_price,
                    "category": sku.category,
                })
                # 低単価商品がゴールデンゾーンにある場合
                if sku.retail_price < 3000:
                    misplaced_low_value.append(sku)

        # ゴールデンゾーン以外にある高単価商品
        non_golden = [
            a for a in all_current_allocs
            if a.shelf_zone != ShelfZone.GOLDEN
        ]
        for a in non_golden:
            sku = self.skus.get(a.sku_id)
            if sku and sku.retail_price >= 10000:
                misplaced_high_value.append({
                    "sku_id": sku.sku_id,
                    "product_name": sku.product_name,
                    "retail_price": sku.retail_price,
                    "current_zone": a.shelf_zone.value,
                })

        golden_avg_price = (
            sum(p["retail_price"] for p in golden_products) / len(golden_products)
            if golden_products else 0
        )

        return {
            "store_id": store_id,
            "total_fixtures": len(store_fixtures),
            "golden_zone_products": len(golden_products),
            "golden_zone_avg_price": round(golden_avg_price, 0),
            "misplaced_high_value_products": misplaced_high_value,
            "misplaced_low_value_in_golden": [
                {"sku_id": s.sku_id, "product_name": s.product_name, "price": s.retail_price}
                for s in misplaced_low_value
            ],
            "optimization_score": self._calculate_optimization_score(
                golden_products, misplaced_high_value, misplaced_low_value
            ),
            "recommendations": self._golden_zone_recommendations(
                misplaced_high_value, misplaced_low_value
            ),
        }

    def _calculate_optimization_score(
        self, golden: list, misplaced_high: list, misplaced_low: list
    ) -> float:
        """棚割最適化スコア (0-100)"""
        if not golden:
            return 0
        penalty = len(misplaced_high) * 5 + len(misplaced_low) * 3
        base_score = 100
        return max(0, min(100, base_score - penalty))

    def _golden_zone_recommendations(
        self, misplaced_high: list, misplaced_low: list
    ) -> list[str]:
        """ゴールデンゾーン最適化の推奨事項"""
        recs = []
        if misplaced_high:
            recs.append(
                f"高単価商品{len(misplaced_high)}点がゴールデンゾーン外に配置されています。"
                "目線の高さ(120-150cm)への移動を推奨します"
            )
            for p in misplaced_high[:5]:
                recs.append(
                    f"  → {p['product_name']}（¥{p['retail_price']:,.0f}）を"
                    f"{p['current_zone']}からゴールデンゾーンへ移動"
                )
        if misplaced_low:
            recs.append(
                f"低単価商品{len(misplaced_low)}点がゴールデンゾーンにあります。"
                "下段または上段への移動を検討してください"
            )
        if not misplaced_high and not misplaced_low:
            recs.append("ゴールデンゾーンの配置は最適です")
        return recs

    def measure_shelf_performance(
        self,
        fixture_id: str,
        period_start: date,
        period_end: date
    ) -> list[dict]:
        """棚割効果測定"""
        current_allocs = [
            a for a in self.allocations
            if a.fixture_id == fixture_id and a.is_current
        ]

        results = []
        for alloc in current_allocs:
            sku_txns = [
                t for t in self.transactions
                if t.sku_id == alloc.sku_id
                and period_start <= t.transaction_date.date() <= period_end
            ]

            units_sold = sum(t.quantity for t in sku_txns)
            revenue = sum(t.total_amount for t in sku_txns)
            sku = self.skus.get(alloc.sku_id)
            cost = sku.cost_price * units_sold if sku else 0
            profit = revenue - cost

            revenue_per_face = revenue / alloc.face_count if alloc.face_count > 0 else 0
            zone_potential = self.ZONE_POTENTIAL.get(alloc.shelf_zone, 0.5)
            efficiency_score = revenue_per_face * zone_potential

            results.append({
                "allocation_id": alloc.allocation_id,
                "sku_id": alloc.sku_id,
                "product_name": sku.product_name if sku else "不明",
                "zone": alloc.shelf_zone.value,
                "face_count": alloc.face_count,
                "units_sold": units_sold,
                "revenue": revenue,
                "profit": profit,
                "revenue_per_face": round(revenue_per_face, 0),
                "efficiency_score": round(efficiency_score, 1),
                "zone_potential": zone_potential,
            })

        results.sort(key=lambda r: r["efficiency_score"], reverse=True)
        return results

    def suggest_reallocation(self, store_id: str, period_start: date, period_end: date) -> dict:
        """棚割再配置の提案"""
        store_fixtures = [f for f in self.fixtures if f.store_id == store_id]

        all_performances = []
        for fixture in store_fixtures:
            perf = self.measure_shelf_performance(fixture.fixture_id, period_start, period_end)
            all_performances.extend(perf)

        if not all_performances:
            return {"store_id": store_id, "suggestions": [], "message": "パフォーマンスデータなし"}

        # 高効率だがゴールデンゾーン外の商品
        promote_candidates = [
            p for p in all_performances
            if p["zone"] != "golden" and p["efficiency_score"] > 0
        ]
        promote_candidates.sort(key=lambda p: p["efficiency_score"], reverse=True)

        # 低効率でゴールデンゾーン内の商品
        demote_candidates = [
            p for p in all_performances
            if p["zone"] == "golden" and p["efficiency_score"] >= 0
        ]
        demote_candidates.sort(key=lambda p: p["efficiency_score"])

        suggestions = []
        swap_count = min(len(promote_candidates), len(demote_candidates), 10)

        for i in range(swap_count):
            up = promote_candidates[i]
            down = demote_candidates[i]
            if up["efficiency_score"] > down["efficiency_score"]:
                expected_lift = (
                    (self.ZONE_POTENTIAL[ShelfZone.GOLDEN] - self.ZONE_POTENTIAL.get(
                        ShelfZone(up["zone"]), 0.5
                    )) * up["revenue_per_face"]
                )
                suggestions.append({
                    "action": "swap",
                    "promote": {
                        "sku_id": up["sku_id"],
                        "product": up["product_name"],
                        "from_zone": up["zone"],
                        "to_zone": "golden",
                        "current_score": up["efficiency_score"],
                    },
                    "demote": {
                        "sku_id": down["sku_id"],
                        "product": down["product_name"],
                        "from_zone": "golden",
                        "to_zone": up["zone"],
                        "current_score": down["efficiency_score"],
                    },
                    "expected_revenue_lift": round(expected_lift, 0),
                })

        total_expected_lift = sum(s["expected_revenue_lift"] for s in suggestions)

        return {
            "store_id": store_id,
            "analysis_period": f"{period_start} ~ {period_end}",
            "total_suggestions": len(suggestions),
            "suggestions": suggestions,
            "total_expected_revenue_lift": total_expected_lift,
            "summary": f"{len(suggestions)}件の棚割変更で推定¥{total_expected_lift:,.0f}の売上増が見込めます"
            if suggestions else "現在の棚割は最適です",
        }

    def get_zone_performance_summary(self, store_id: str, period_start: date, period_end: date) -> dict:
        """ゾーン別パフォーマンスサマリー"""
        store_fixtures = [f for f in self.fixtures if f.store_id == store_id]

        zone_data = {}
        for zone in ShelfZone:
            zone_data[zone.value] = {
                "product_count": 0,
                "total_revenue": 0,
                "total_profit": 0,
                "total_faces": 0,
                "avg_revenue_per_face": 0,
            }

        for fixture in store_fixtures:
            perfs = self.measure_shelf_performance(fixture.fixture_id, period_start, period_end)
            for p in perfs:
                z = p["zone"]
                zone_data[z]["product_count"] += 1
                zone_data[z]["total_revenue"] += p["revenue"]
                zone_data[z]["total_profit"] += p["profit"]
                zone_data[z]["total_faces"] += p["face_count"]

        for z in zone_data:
            faces = zone_data[z]["total_faces"]
            zone_data[z]["avg_revenue_per_face"] = round(
                zone_data[z]["total_revenue"] / faces, 0
            ) if faces > 0 else 0

        return {
            "store_id": store_id,
            "period": f"{period_start} ~ {period_end}",
            "zone_performance": zone_data,
            "best_zone": max(zone_data, key=lambda z: zone_data[z]["avg_revenue_per_face"]),
            "worst_zone": min(zone_data, key=lambda z: zone_data[z]["avg_revenue_per_face"])
            if any(zone_data[z]["total_revenue"] > 0 for z in zone_data) else "N/A",
        }
