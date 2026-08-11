"""
ワールドスポーツ プロモーション管理システム
- セール価格販売（特定SKUの期間限定値引き）
- ハウスポイント付与（通常1倍→セール時10倍）
- クーポン配布（特定商品に対する値引き）
- お誕生日クーポン（60歳以上特別日、新規会員加入ポイント）
"""

from datetime import datetime, date, timedelta
from typing import Optional
import json
import os

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.base import (
    PromotionType, CouponType, MemberTier, ShelfZone,
    Store, SKU, Member, SalePrice, PointMultiplier,
    Coupon, BirthdayCoupon, NewMemberBonus, SalesTransaction
)


class PromotionManager:
    """プロモーション統合管理"""

    def __init__(self):
        self.sale_prices: list[SalePrice] = []
        self.point_multipliers: list[PointMultiplier] = []
        self.coupons: list[Coupon] = []
        self.birthday_coupons: list[BirthdayCoupon] = []
        self.new_member_bonuses: list[NewMemberBonus] = []
        self.transactions: list[SalesTransaction] = []

    # ==========================================================================
    # セール価格管理
    # ==========================================================================

    def create_sale_price(
        self,
        sku: SKU,
        store_id: str,
        sale_price: float,
        start_date: datetime,
        end_date: datetime,
        reason: str = ""
    ) -> SalePrice:
        """セール価格を設定"""
        if sale_price >= sku.retail_price:
            raise ValueError(
                f"セール価格({sale_price})は定価({sku.retail_price})より低く設定してください"
            )
        if start_date >= end_date:
            raise ValueError("開始日は終了日より前に設定してください")

        discount_rate = round((1 - sale_price / sku.retail_price) * 100, 1)
        sale = SalePrice(
            sale_id=f"SALE-{len(self.sale_prices) + 1:06d}",
            sku_id=sku.sku_id,
            store_id=store_id,
            original_price=sku.retail_price,
            sale_price=sale_price,
            discount_rate=discount_rate,
            start_date=start_date,
            end_date=end_date,
            reason=reason,
        )
        self.sale_prices.append(sale)
        return sale

    def get_active_sales(self, store_id: str, at_time: Optional[datetime] = None) -> list[SalePrice]:
        """指定店舗の有効なセール一覧を取得"""
        now = at_time or datetime.now()
        return [
            s for s in self.sale_prices
            if s.store_id == store_id and s.is_active
            and s.start_date <= now <= s.end_date
        ]

    def get_sale_price_for_sku(
        self, sku_id: str, store_id: str, at_time: Optional[datetime] = None
    ) -> Optional[SalePrice]:
        """特定SKUの現在のセール価格を取得"""
        active = self.get_active_sales(store_id, at_time)
        matches = [s for s in active if s.sku_id == sku_id]
        if matches:
            return min(matches, key=lambda s: s.sale_price)
        return None

    def calculate_sale_impact(self, sale: SalePrice) -> dict:
        """セール施策のインパクトを試算"""
        discount_per_unit = sale.original_price - sale.sale_price
        return {
            "sale_id": sale.sale_id,
            "sku_id": sale.sku_id,
            "discount_rate_pct": sale.discount_rate,
            "discount_per_unit": discount_per_unit,
            "break_even_increase_pct": round(
                (discount_per_unit / sale.sale_price) * 100, 1
            ),
            "margin_impact_warning": discount_per_unit > sale.original_price * 0.3,
        }

    # ==========================================================================
    # ハウスポイント管理
    # ==========================================================================

    def create_point_multiplier(
        self,
        store_id: str,
        campaign_multiplier: float,
        start_date: datetime,
        end_date: datetime,
        target_category: Optional[str] = None,
        target_tier: Optional[MemberTier] = None,
        base_multiplier: float = 1.0
    ) -> PointMultiplier:
        """ポイント倍率キャンペーンを設定"""
        if campaign_multiplier < base_multiplier:
            raise ValueError("キャンペーン倍率は通常倍率以上に設定してください")

        pm = PointMultiplier(
            multiplier_id=f"PM-{len(self.point_multipliers) + 1:06d}",
            store_id=store_id,
            base_multiplier=base_multiplier,
            campaign_multiplier=campaign_multiplier,
            target_category=target_category,
            target_tier=target_tier,
            start_date=start_date,
            end_date=end_date,
        )
        self.point_multipliers.append(pm)
        return pm

    def calculate_points(
        self,
        purchase_amount: float,
        store_id: str,
        member: Member,
        category: Optional[str] = None,
        at_time: Optional[datetime] = None
    ) -> dict:
        """購入時の獲得ポイントを計算"""
        now = at_time or datetime.now()
        base_points = int(purchase_amount)  # 1円=1ポイント（基本）

        # 有効なキャンペーン倍率を検索
        best_multiplier = 1.0
        applied_campaign = None

        for pm in self.point_multipliers:
            if not pm.is_active or pm.store_id != store_id:
                continue
            if not (pm.start_date <= now <= pm.end_date):
                continue
            if pm.target_category and pm.target_category != category:
                continue
            if pm.target_tier and pm.target_tier != member.tier:
                continue
            if pm.campaign_multiplier > best_multiplier:
                best_multiplier = pm.campaign_multiplier
                applied_campaign = pm

        earned_points = int(base_points * best_multiplier)

        return {
            "base_points": base_points,
            "multiplier": best_multiplier,
            "earned_points": earned_points,
            "bonus_points": earned_points - base_points,
            "applied_campaign_id": applied_campaign.multiplier_id if applied_campaign else None,
            "point_cost": earned_points * 1,  # 1ポイント=1円として原価計算
        }

    def estimate_point_liability(self, store_id: str) -> dict:
        """ポイント債務（未使用ポイント残高）の推定"""
        active_campaigns = [
            pm for pm in self.point_multipliers
            if pm.store_id == store_id and pm.is_active
        ]
        return {
            "store_id": store_id,
            "active_campaigns": len(active_campaigns),
            "max_multiplier": max(
                (pm.campaign_multiplier for pm in active_campaigns), default=1.0
            ),
            "warning": any(pm.campaign_multiplier >= 10.0 for pm in active_campaigns),
            "recommendation": "10倍ポイント施策は高コスト。対象カテゴリ/会員ランクを限定してください"
            if any(pm.campaign_multiplier >= 10.0 for pm in active_campaigns)
            else "ポイント倍率は適正範囲内です",
        }

    # ==========================================================================
    # クーポン管理
    # ==========================================================================

    def create_coupon(
        self,
        coupon_type: CouponType,
        discount_value: float,
        start_date: datetime,
        end_date: datetime,
        min_purchase: float = 0,
        target_sku_ids: Optional[list] = None,
        target_category: Optional[str] = None,
        target_member_tiers: Optional[list] = None,
        max_uses: int = 1000,
    ) -> Coupon:
        """クーポンを作成"""
        coupon_code = f"WS-{coupon_type.value[:3].upper()}-{len(self.coupons) + 1:06d}"

        coupon = Coupon(
            coupon_id=f"CPN-{len(self.coupons) + 1:06d}",
            coupon_code=coupon_code,
            coupon_type=coupon_type,
            discount_value=discount_value,
            min_purchase=min_purchase,
            target_sku_ids=target_sku_ids or [],
            target_category=target_category,
            target_member_tiers=target_member_tiers or [t for t in MemberTier],
            max_uses=max_uses,
            current_uses=0,
            start_date=start_date,
            end_date=end_date,
        )
        self.coupons.append(coupon)
        return coupon

    def redeem_coupon(
        self,
        coupon_id: str,
        member: Member,
        purchase_amount: float,
        sku_id: Optional[str] = None,
        category: Optional[str] = None
    ) -> dict:
        """クーポンを利用"""
        coupon = next((c for c in self.coupons if c.coupon_id == coupon_id), None)
        if not coupon:
            return {"success": False, "error": "クーポンが見つかりません"}
        if not coupon.is_active:
            return {"success": False, "error": "このクーポンは無効です"}
        if coupon.remaining_uses <= 0:
            return {"success": False, "error": "クーポン利用上限に達しました"}
        if member.tier not in coupon.target_member_tiers:
            return {"success": False, "error": "会員ランクが対象外です"}
        if purchase_amount < coupon.min_purchase:
            return {"success": False, "error": f"最低購入金額({coupon.min_purchase}円)に達していません"}
        if coupon.target_sku_ids and sku_id not in coupon.target_sku_ids:
            return {"success": False, "error": "対象商品ではありません"}
        if coupon.target_category and category != coupon.target_category:
            return {"success": False, "error": "対象カテゴリではありません"}

        now = datetime.now()
        if not (coupon.start_date <= now <= coupon.end_date):
            return {"success": False, "error": "クーポン有効期間外です"}

        # 値引額計算
        if coupon.coupon_type == CouponType.FIXED_DISCOUNT:
            discount = coupon.discount_value
        elif coupon.coupon_type == CouponType.PERCENT_DISCOUNT:
            discount = purchase_amount * (coupon.discount_value / 100)
        else:
            discount = 0

        coupon.current_uses += 1
        return {
            "success": True,
            "coupon_id": coupon_id,
            "coupon_code": coupon.coupon_code,
            "discount_amount": round(discount, 0),
            "final_amount": round(purchase_amount - discount, 0),
            "remaining_uses": coupon.remaining_uses,
        }

    def get_coupon_effectiveness(self, coupon_id: str) -> dict:
        """クーポンの効果を分析"""
        coupon = next((c for c in self.coupons if c.coupon_id == coupon_id), None)
        if not coupon:
            return {"error": "クーポンが見つかりません"}

        related_txns = [
            t for t in self.transactions if t.coupon_id == coupon_id
        ]
        total_discount = sum(t.discount_amount for t in related_txns)
        total_revenue = sum(t.total_amount for t in related_txns)

        return {
            "coupon_id": coupon_id,
            "coupon_code": coupon.coupon_code,
            "usage_rate": coupon.usage_rate,
            "total_uses": coupon.current_uses,
            "total_discount_given": total_discount,
            "total_revenue_generated": total_revenue,
            "roi": round((total_revenue - total_discount) / total_discount, 2)
            if total_discount > 0 else 0,
            "avg_basket_size": round(total_revenue / len(related_txns), 0)
            if related_txns else 0,
        }

    # ==========================================================================
    # お誕生日クーポン / シニア特別日 / 新規会員加入ポイント
    # ==========================================================================

    def issue_birthday_coupon(
        self,
        member: Member,
        discount_value: float = 500,
        senior_special_discount: float = 1000,
        validity_days: int = 30
    ) -> BirthdayCoupon:
        """お誕生日クーポンを発行"""
        is_senior = member.is_senior
        actual_discount = senior_special_discount if is_senior else discount_value

        coupon = self.create_coupon(
            coupon_type=CouponType.FIXED_DISCOUNT,
            discount_value=actual_discount,
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=validity_days),
            target_member_tiers=[member.tier],
            max_uses=1,
        )

        birthday_coupon = BirthdayCoupon(
            birthday_coupon_id=f"BD-{len(self.birthday_coupons) + 1:06d}",
            member_id=member.member_id,
            coupon=coupon,
            birth_month=member.birth_date.month,
            is_senior_special=is_senior,
            special_discount_value=actual_discount,
            issued_date=date.today(),
            expiry_date=date.today() + timedelta(days=validity_days),
        )
        self.birthday_coupons.append(birthday_coupon)
        return birthday_coupon

    def issue_new_member_bonus(
        self,
        member: Member,
        bonus_points: int = 500,
        welcome_coupon_value: float = 300,
        validity_days: int = 60
    ) -> NewMemberBonus:
        """新規会員加入ポイント・ウェルカムクーポンを発行"""
        welcome_coupon = self.create_coupon(
            coupon_type=CouponType.FIXED_DISCOUNT,
            discount_value=welcome_coupon_value,
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=validity_days),
            target_member_tiers=[MemberTier.REGULAR],
            max_uses=1,
        )

        bonus = NewMemberBonus(
            bonus_id=f"NMB-{len(self.new_member_bonuses) + 1:06d}",
            member_id=member.member_id,
            bonus_points=bonus_points,
            bonus_coupon=welcome_coupon,
            issued_date=date.today(),
            expiry_date=date.today() + timedelta(days=validity_days),
        )
        self.new_member_bonuses.append(bonus)
        member.total_points += bonus_points
        return bonus

    def get_birthday_members_this_month(
        self, members: list[Member], target_month: Optional[int] = None
    ) -> list[dict]:
        """今月が誕生日の会員一覧とクーポン発行状況"""
        month = target_month or date.today().month
        birthday_members = [m for m in members if m.birth_date.month == month]

        result = []
        for m in birthday_members:
            already_issued = any(
                bc.member_id == m.member_id
                and bc.birth_month == month
                and bc.issued_date.year == date.today().year
                for bc in self.birthday_coupons
            )
            result.append({
                "member_id": m.member_id,
                "name": m.name,
                "birth_date": m.birth_date.isoformat(),
                "is_senior": m.is_senior,
                "tier": m.tier.value,
                "coupon_issued": already_issued,
            })
        return result

    # ==========================================================================
    # 統合プロモーション分析
    # ==========================================================================

    def get_promotion_summary(self, store_id: str) -> dict:
        """店舗別プロモーション施策サマリー"""
        active_sales = self.get_active_sales(store_id)
        active_point_campaigns = [
            pm for pm in self.point_multipliers
            if pm.store_id == store_id and pm.is_active
            and pm.start_date <= datetime.now() <= pm.end_date
        ]
        active_coupons = [
            c for c in self.coupons
            if c.is_active and c.start_date <= datetime.now() <= c.end_date
        ]

        total_discount_exposure = sum(
            s.discount_amount for s in active_sales
        )

        return {
            "store_id": store_id,
            "snapshot_date": datetime.now().isoformat(),
            "active_promotions": {
                "sale_prices": len(active_sales),
                "point_campaigns": len(active_point_campaigns),
                "active_coupons": len(active_coupons),
            },
            "total_discount_exposure": total_discount_exposure,
            "max_point_multiplier": max(
                (pm.campaign_multiplier for pm in active_point_campaigns), default=1.0
            ),
            "coupon_usage_rates": {
                c.coupon_id: c.usage_rate for c in active_coupons
            },
            "risk_alerts": self._generate_risk_alerts(
                active_sales, active_point_campaigns, active_coupons
            ),
        }

    def _generate_risk_alerts(
        self,
        sales: list[SalePrice],
        point_campaigns: list[PointMultiplier],
        coupons: list[Coupon]
    ) -> list[str]:
        """リスクアラートを生成"""
        alerts = []

        # 高割引率アラート
        high_discount = [s for s in sales if s.discount_rate > 40]
        if high_discount:
            alerts.append(
                f"⚠ 40%超の値引きが{len(high_discount)}件あります。ロス率への影響を確認してください"
            )

        # 高ポイント倍率アラート
        high_points = [pm for pm in point_campaigns if pm.campaign_multiplier >= 10]
        if high_points:
            alerts.append(
                f"⚠ 10倍以上のポイント施策が{len(high_points)}件。ポイント債務増大に注意"
            )

        # クーポン利用率低アラート
        low_usage = [c for c in coupons if c.usage_rate < 0.05 and c.current_uses > 0]
        if low_usage:
            alerts.append(
                f"⚠ 利用率5%未満のクーポンが{len(low_usage)}件。施策の見直しを検討"
            )

        # 施策過多アラート
        total_promos = len(sales) + len(point_campaigns) + len(coupons)
        if total_promos > 20:
            alerts.append(
                f"⚠ 同時実施施策が{total_promos}件と多すぎます。効果の希薄化に注意"
            )

        return alerts
