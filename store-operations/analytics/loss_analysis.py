"""
ワールドスポーツ ロス率分析・PDCAサイクル管理システム
- ロス率トラッキング（棚卸ロス、値引ロス、廃棄ロス）
- プロモーション施策の効果測定
- PDCAサイクルによる改善管理
- KPIダッシュボード用データ生成
"""

from datetime import date, datetime, timedelta
from typing import Optional
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.base import (
    PromotionType, PDCACycle, MemberTier,
    Store, SKU, SalesTransaction, LossRecord,
    PromotionEffectiveness, PDCARecord
)


class LossAnalyzer:
    """ロス率分析エンジン"""

    def __init__(self):
        self.loss_records: list[LossRecord] = []
        self.transactions: list[SalesTransaction] = []

    def record_loss(
        self,
        store_id: str,
        sku_id: str,
        loss_type: str,
        quantity: int,
        loss_amount: float,
        cause: str
    ) -> LossRecord:
        """ロスを記録"""
        record = LossRecord(
            loss_id=f"LOSS-{len(self.loss_records) + 1:06d}",
            store_id=store_id,
            sku_id=sku_id,
            loss_type=loss_type,
            quantity=quantity,
            loss_amount=loss_amount,
            cause=cause,
            recorded_date=date.today(),
        )
        self.loss_records.append(record)
        return record

    def calculate_loss_rate(
        self,
        store_id: str,
        period_start: date,
        period_end: date
    ) -> dict:
        """店舗別ロス率を計算"""
        period_losses = [
            lr for lr in self.loss_records
            if lr.store_id == store_id
            and period_start <= lr.recorded_date <= period_end
        ]
        period_sales = [
            t for t in self.transactions
            if t.store_id == store_id
            and period_start <= t.transaction_date.date() <= period_end
        ]

        total_loss = sum(lr.loss_amount for lr in period_losses)
        total_sales = sum(t.total_amount for t in period_sales)
        loss_rate = (total_loss / total_sales * 100) if total_sales > 0 else 0

        # ロス種別内訳
        loss_by_type = {}
        for lr in period_losses:
            if lr.loss_type not in loss_by_type:
                loss_by_type[lr.loss_type] = {"count": 0, "amount": 0}
            loss_by_type[lr.loss_type]["count"] += lr.quantity
            loss_by_type[lr.loss_type]["amount"] += lr.loss_amount

        # 原因別内訳
        loss_by_cause = {}
        for lr in period_losses:
            if lr.cause not in loss_by_cause:
                loss_by_cause[lr.cause] = 0
            loss_by_cause[lr.cause] += lr.loss_amount

        return {
            "store_id": store_id,
            "period": f"{period_start} ~ {period_end}",
            "total_sales": total_sales,
            "total_loss": total_loss,
            "loss_rate_pct": round(loss_rate, 2),
            "loss_by_type": loss_by_type,
            "loss_by_cause": dict(sorted(
                loss_by_cause.items(), key=lambda x: x[1], reverse=True
            )),
            "threshold_alert": loss_rate > 2.0,
            "severity": self._loss_severity(loss_rate),
        }

    def _loss_severity(self, loss_rate: float) -> str:
        if loss_rate <= 1.0:
            return "正常"
        elif loss_rate <= 2.0:
            return "注意"
        elif loss_rate <= 3.0:
            return "警告"
        else:
            return "危険"

    def analyze_loss_trend(
        self,
        store_id: str,
        months: int = 12
    ) -> list[dict]:
        """ロス率の月次推移を分析"""
        results = []
        today = date.today()

        for i in range(months):
            month_start = date(
                today.year if today.month - i > 0 else today.year - 1,
                ((today.month - i - 1) % 12) + 1,
                1
            )
            if month_start.month == 12:
                month_end = date(month_start.year + 1, 1, 1) - timedelta(days=1)
            else:
                month_end = date(month_start.year, month_start.month + 1, 1) - timedelta(days=1)

            monthly = self.calculate_loss_rate(store_id, month_start, month_end)
            results.append({
                "month": month_start.strftime("%Y-%m"),
                "loss_rate_pct": monthly["loss_rate_pct"],
                "total_loss": monthly["total_loss"],
                "severity": monthly["severity"],
            })

        return list(reversed(results))

    def identify_high_loss_skus(
        self,
        store_id: str,
        period_start: date,
        period_end: date,
        top_n: int = 20
    ) -> list[dict]:
        """ロスの多いSKUランキング"""
        period_losses = [
            lr for lr in self.loss_records
            if lr.store_id == store_id
            and period_start <= lr.recorded_date <= period_end
        ]

        sku_losses = {}
        for lr in period_losses:
            if lr.sku_id not in sku_losses:
                sku_losses[lr.sku_id] = {"quantity": 0, "amount": 0, "causes": []}
            sku_losses[lr.sku_id]["quantity"] += lr.quantity
            sku_losses[lr.sku_id]["amount"] += lr.loss_amount
            sku_losses[lr.sku_id]["causes"].append(lr.cause)

        ranked = sorted(sku_losses.items(), key=lambda x: x[1]["amount"], reverse=True)
        return [
            {
                "rank": i + 1,
                "sku_id": sku_id,
                "total_quantity": data["quantity"],
                "total_amount": data["amount"],
                "primary_cause": max(set(data["causes"]), key=data["causes"].count),
            }
            for i, (sku_id, data) in enumerate(ranked[:top_n])
        ]

    def promotion_loss_correlation(
        self,
        store_id: str,
        promotion_ids: list[str],
        period_start: date,
        period_end: date
    ) -> dict:
        """プロモーション施策とロスの相関分析"""
        promo_txns = [
            t for t in self.transactions
            if t.store_id == store_id
            and t.promotion_id in promotion_ids
            and period_start <= t.transaction_date.date() <= period_end
        ]
        non_promo_txns = [
            t for t in self.transactions
            if t.store_id == store_id
            and t.promotion_id not in promotion_ids
            and period_start <= t.transaction_date.date() <= period_end
        ]
        period_losses = [
            lr for lr in self.loss_records
            if lr.store_id == store_id
            and period_start <= lr.recorded_date <= period_end
        ]

        promo_revenue = sum(t.total_amount for t in promo_txns)
        promo_discount = sum(t.discount_amount for t in promo_txns)
        non_promo_revenue = sum(t.total_amount for t in non_promo_txns)
        total_loss = sum(lr.loss_amount for lr in period_losses)

        return {
            "store_id": store_id,
            "period": f"{period_start} ~ {period_end}",
            "promotion_revenue": promo_revenue,
            "promotion_discount_total": promo_discount,
            "non_promotion_revenue": non_promo_revenue,
            "total_loss": total_loss,
            "promo_to_loss_ratio": round(promo_discount / total_loss, 2)
            if total_loss > 0 else 0,
            "net_promo_impact": promo_revenue - promo_discount - total_loss,
            "recommendation": self._promo_loss_recommendation(
                promo_discount, total_loss, promo_revenue
            ),
        }

    def _promo_loss_recommendation(
        self, discount: float, loss: float, revenue: float
    ) -> str:
        if revenue == 0:
            return "データ不足のため分析不可"
        loss_to_revenue = loss / revenue
        discount_to_revenue = discount / revenue
        if loss_to_revenue > 0.05:
            return "ロス率が売上の5%超。在庫管理と発注精度の見直しが急務"
        if discount_to_revenue > 0.15:
            return "値引率が売上の15%超。セール施策の頻度と値引幅の見直しを推奨"
        return "ロス率・値引率は許容範囲内。現行施策を継続しつつモニタリング"


class PDCAManager:
    """PDCAサイクル管理"""

    def __init__(self):
        self.pdca_records: list[PDCARecord] = []

    def create_plan(
        self,
        store_id: str,
        promotion_id: str,
        description: str,
        target_kpi: str,
        target_value: float,
        action_items: list[str]
    ) -> PDCARecord:
        """Plan: 施策計画を登録"""
        existing = [
            r for r in self.pdca_records
            if r.store_id == store_id and r.promotion_id == promotion_id
        ]
        cycle_number = len(existing) // 4 + 1

        record = PDCARecord(
            pdca_id=f"PDCA-{len(self.pdca_records) + 1:06d}",
            store_id=store_id,
            promotion_id=promotion_id,
            cycle_number=cycle_number,
            phase=PDCACycle.PLAN,
            description=description,
            target_kpi=target_kpi,
            target_value=target_value,
            actual_value=None,
            gap_analysis="",
            action_items=action_items,
            created_date=date.today(),
            completed_date=None,
        )
        self.pdca_records.append(record)
        return record

    def record_execution(
        self,
        store_id: str,
        promotion_id: str,
        description: str,
        target_kpi: str,
        target_value: float
    ) -> PDCARecord:
        """Do: 施策実行を記録"""
        record = PDCARecord(
            pdca_id=f"PDCA-{len(self.pdca_records) + 1:06d}",
            store_id=store_id,
            promotion_id=promotion_id,
            cycle_number=self._current_cycle(store_id, promotion_id),
            phase=PDCACycle.DO,
            description=description,
            target_kpi=target_kpi,
            target_value=target_value,
            actual_value=None,
            gap_analysis="",
            action_items=[],
            created_date=date.today(),
            completed_date=None,
        )
        self.pdca_records.append(record)
        return record

    def evaluate_results(
        self,
        store_id: str,
        promotion_id: str,
        actual_value: float,
        gap_analysis: str
    ) -> PDCARecord:
        """Check: 結果を評価"""
        plan_records = [
            r for r in self.pdca_records
            if r.store_id == store_id
            and r.promotion_id == promotion_id
            and r.phase == PDCACycle.PLAN
        ]
        latest_plan = plan_records[-1] if plan_records else None
        target_value = latest_plan.target_value if latest_plan else 0
        target_kpi = latest_plan.target_kpi if latest_plan else ""

        achievement_rate = (actual_value / target_value * 100) if target_value > 0 else 0

        record = PDCARecord(
            pdca_id=f"PDCA-{len(self.pdca_records) + 1:06d}",
            store_id=store_id,
            promotion_id=promotion_id,
            cycle_number=self._current_cycle(store_id, promotion_id),
            phase=PDCACycle.CHECK,
            description=f"目標達成率: {achievement_rate:.1f}%",
            target_kpi=target_kpi,
            target_value=target_value,
            actual_value=actual_value,
            gap_analysis=gap_analysis,
            action_items=[],
            created_date=date.today(),
            completed_date=date.today(),
        )
        self.pdca_records.append(record)
        return record

    def define_improvements(
        self,
        store_id: str,
        promotion_id: str,
        description: str,
        action_items: list[str]
    ) -> PDCARecord:
        """Act: 改善策を定義"""
        record = PDCARecord(
            pdca_id=f"PDCA-{len(self.pdca_records) + 1:06d}",
            store_id=store_id,
            promotion_id=promotion_id,
            cycle_number=self._current_cycle(store_id, promotion_id),
            phase=PDCACycle.ACT,
            description=description,
            target_kpi="",
            target_value=0,
            actual_value=None,
            gap_analysis="",
            action_items=action_items,
            created_date=date.today(),
            completed_date=None,
        )
        self.pdca_records.append(record)
        return record

    def get_pdca_history(self, store_id: str, promotion_id: str) -> list[dict]:
        """施策のPDCA履歴を取得"""
        records = [
            r for r in self.pdca_records
            if r.store_id == store_id and r.promotion_id == promotion_id
        ]
        return [
            {
                "pdca_id": r.pdca_id,
                "cycle": r.cycle_number,
                "phase": r.phase.value,
                "description": r.description,
                "target_kpi": r.target_kpi,
                "target_value": r.target_value,
                "actual_value": r.actual_value,
                "gap_analysis": r.gap_analysis,
                "action_items": r.action_items,
                "created_date": r.created_date.isoformat(),
            }
            for r in records
        ]

    def get_improvement_scorecard(self, store_id: str) -> dict:
        """店舗別改善スコアカード"""
        store_records = [
            r for r in self.pdca_records if r.store_id == store_id
        ]
        check_records = [
            r for r in store_records if r.phase == PDCACycle.CHECK and r.actual_value is not None
        ]

        if not check_records:
            return {
                "store_id": store_id,
                "total_cycles": 0,
                "message": "評価データがありません",
            }

        achievements = []
        for r in check_records:
            if r.target_value > 0:
                achievements.append(r.actual_value / r.target_value * 100)

        avg_achievement = sum(achievements) / len(achievements) if achievements else 0
        improving = len([a for a in achievements if a >= 100])

        return {
            "store_id": store_id,
            "total_cycles": max(r.cycle_number for r in store_records),
            "total_checks": len(check_records),
            "avg_achievement_rate": round(avg_achievement, 1),
            "target_met_count": improving,
            "target_met_rate": round(improving / len(check_records) * 100, 1)
            if check_records else 0,
            "trend": "改善傾向" if len(achievements) >= 2 and achievements[-1] > achievements[0]
            else "横ばいまたは悪化",
            "next_action": self._suggest_next_action(avg_achievement),
        }

    def _current_cycle(self, store_id: str, promotion_id: str) -> int:
        existing = [
            r for r in self.pdca_records
            if r.store_id == store_id and r.promotion_id == promotion_id
        ]
        return max((r.cycle_number for r in existing), default=1)

    def _suggest_next_action(self, avg_achievement: float) -> str:
        if avg_achievement >= 100:
            return "目標達成。次サイクルでは目標値を引き上げて更なる改善を"
        elif avg_achievement >= 80:
            return "目標に近接。微調整で達成可能。施策の精度向上に注力"
        elif avg_achievement >= 50:
            return "目標未達。施策の根本的な見直しと原因分析が必要"
        else:
            return "大幅未達。施策の前提条件から再検討が必要"
