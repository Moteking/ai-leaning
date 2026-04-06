"""
ワールドスポーツ 店舗運営改善システム - データモデル定義
"""

from dataclasses import dataclass, field
from datetime import datetime, date
from enum import Enum
from typing import Optional


# ==============================================================================
# 列挙型定義
# ==============================================================================

class PromotionType(Enum):
    """プロモーション種別"""
    SALE_PRICE = "sale_price"           # セール価格販売
    POINT_MULTIPLIER = "point_multiplier"  # ハウスポイント倍率変更
    COUPON = "coupon"                   # クーポン配布
    BIRTHDAY_COUPON = "birthday_coupon"  # お誕生日クーポン
    NEW_MEMBER_POINTS = "new_member_points"  # 新規会員加入ポイント
    SENIOR_SPECIAL = "senior_special"    # 60歳以上特別日


class CouponType(Enum):
    """クーポン種別"""
    FIXED_DISCOUNT = "fixed_discount"     # 定額値引き（例: 500円引き）
    PERCENT_DISCOUNT = "percent_discount"  # 定率値引き（例: 10%OFF）
    FREE_SHIPPING = "free_shipping"       # 送料無料
    GIFT = "gift"                         # 景品付与


class MemberTier(Enum):
    """会員ランク"""
    REGULAR = "regular"       # 一般
    SILVER = "silver"         # シルバー
    GOLD = "gold"             # ゴールド
    PLATINUM = "platinum"     # プラチナ


class ShelfZone(Enum):
    """棚ゾーン区分"""
    GOLDEN = "golden"         # ゴールデンゾーン（目線の高さ 120-150cm）
    UPPER = "upper"           # 上段（150cm以上）
    MIDDLE = "middle"         # 中段（80-120cm）
    LOWER = "lower"           # 下段（80cm以下）
    END_CAP = "end_cap"       # エンドキャップ（棚端）
    FLOOR = "floor"           # フロア什器


class PDCACycle(Enum):
    """PDCAサイクルフェーズ"""
    PLAN = "plan"
    DO = "do"
    CHECK = "check"
    ACT = "act"


# ==============================================================================
# 基本データモデル
# ==============================================================================

@dataclass
class Store:
    """店舗"""
    store_id: str
    store_name: str
    region: str               # 地域（九州、関東 等）
    address: str
    floor_area_sqm: float     # 売場面積（㎡）
    shelf_count: int          # 什器数
    opening_date: date
    manager_name: str


@dataclass
class SKU:
    """商品SKU"""
    sku_id: str
    product_name: str
    category: str             # カテゴリ（シューズ、ウェア 等）
    subcategory: str          # サブカテゴリ
    brand: str
    cost_price: float         # 原価
    retail_price: float       # 定価
    current_stock: int        # 現在在庫数
    size: str
    color: str
    supplier: str
    lead_time_days: int       # 納品リードタイム


@dataclass
class Member:
    """会員"""
    member_id: str
    name: str
    email: str
    phone: str
    birth_date: date
    age: int
    tier: MemberTier
    join_date: date
    total_points: int          # 累計保有ポイント
    total_purchases: float     # 累計購入金額
    home_store_id: str         # メイン利用店舗
    is_senior: bool = False    # 60歳以上フラグ

    def __post_init__(self):
        self.is_senior = self.age >= 60


# ==============================================================================
# プロモーション関連データモデル
# ==============================================================================

@dataclass
class SalePrice:
    """セール価格設定"""
    sale_id: str
    sku_id: str
    store_id: str
    original_price: float
    sale_price: float
    discount_rate: float       # 値引率
    start_date: datetime
    end_date: datetime
    reason: str                # セール理由（シーズンオフ、在庫処分 等）
    is_active: bool = True

    @property
    def discount_amount(self) -> float:
        return self.original_price - self.sale_price


@dataclass
class PointMultiplier:
    """ポイント倍率設定"""
    multiplier_id: str
    store_id: str
    base_multiplier: float     # 通常倍率（例: 1.0）
    campaign_multiplier: float  # キャンペーン倍率（例: 10.0）
    target_category: Optional[str]  # 対象カテゴリ（Noneは全カテゴリ）
    target_tier: Optional[MemberTier]  # 対象会員ランク（Noneは全ランク）
    start_date: datetime
    end_date: datetime
    is_active: bool = True


@dataclass
class Coupon:
    """クーポン"""
    coupon_id: str
    coupon_code: str
    coupon_type: CouponType
    discount_value: float      # 値引額 or 値引率
    min_purchase: float        # 最低購入金額
    target_sku_ids: list       # 対象SKU一覧（空なら全商品）
    target_category: Optional[str]
    target_member_tiers: list  # 対象会員ランク
    max_uses: int              # 最大利用回数
    current_uses: int          # 現在利用回数
    start_date: datetime
    end_date: datetime
    is_active: bool = True

    @property
    def remaining_uses(self) -> int:
        return self.max_uses - self.current_uses

    @property
    def usage_rate(self) -> float:
        return self.current_uses / self.max_uses if self.max_uses > 0 else 0


@dataclass
class BirthdayCoupon:
    """お誕生日クーポン"""
    birthday_coupon_id: str
    member_id: str
    coupon: Coupon
    birth_month: int
    is_senior_special: bool    # 60歳以上特別日フラグ
    special_discount_value: float  # シニア特別割引額
    issued_date: date
    expiry_date: date
    is_redeemed: bool = False


@dataclass
class NewMemberBonus:
    """新規会員加入ポイント"""
    bonus_id: str
    member_id: str
    bonus_points: int          # 加入ポイント
    bonus_coupon: Optional[Coupon]  # 加入クーポン
    issued_date: date
    expiry_date: date
    is_redeemed: bool = False


# ==============================================================================
# 売上・ロス分析関連データモデル
# ==============================================================================

@dataclass
class SalesTransaction:
    """売上トランザクション"""
    transaction_id: str
    store_id: str
    member_id: Optional[str]
    sku_id: str
    quantity: int
    unit_price: float          # 販売単価
    total_amount: float        # 販売金額
    discount_amount: float     # 値引額
    points_earned: int         # 獲得ポイント
    points_used: int           # 使用ポイント
    coupon_id: Optional[str]
    promotion_id: Optional[str]
    transaction_date: datetime


@dataclass
class LossRecord:
    """ロス記録"""
    loss_id: str
    store_id: str
    sku_id: str
    loss_type: str             # 棚卸ロス、値引ロス、廃棄ロス 等
    quantity: int
    loss_amount: float         # ロス金額
    cause: str                 # 原因
    recorded_date: date


@dataclass
class PromotionEffectiveness:
    """プロモーション効果測定"""
    measurement_id: str
    promotion_type: PromotionType
    promotion_id: str
    store_id: str
    period_start: date
    period_end: date
    total_sales: float         # 期間売上
    baseline_sales: float      # ベースライン売上（プロモなし想定）
    incremental_sales: float   # 増分売上
    promotion_cost: float      # プロモーションコスト
    loss_amount: float         # ロス金額
    roi: float                 # ROI
    redemption_rate: float     # クーポン利用率
    customer_count: int        # 利用顧客数
    repeat_rate: float         # リピート率


@dataclass
class PDCARecord:
    """PDCAサイクル記録"""
    pdca_id: str
    store_id: str
    promotion_id: str
    cycle_number: int          # サイクル番号
    phase: PDCACycle
    description: str           # 内容
    target_kpi: str            # 目標KPI
    target_value: float        # 目標値
    actual_value: Optional[float]  # 実績値
    gap_analysis: str          # 差異分析
    action_items: list         # アクション項目
    created_date: date
    completed_date: Optional[date]


# ==============================================================================
# プラノグラム関連データモデル
# ==============================================================================

@dataclass
class Fixture:
    """什器（棚・ディスプレイ）"""
    fixture_id: str
    store_id: str
    fixture_type: str          # ゴンドラ、壁面棚、什器台 等
    location: str              # 店内位置
    width_cm: float
    height_cm: float
    depth_cm: float
    shelf_count: int           # 段数
    max_weight_kg: float       # 最大耐荷重


@dataclass
class ShelfAllocation:
    """棚割配置"""
    allocation_id: str
    fixture_id: str
    shelf_zone: ShelfZone
    sku_id: str
    face_count: int            # フェイス数
    position_x: int            # 横位置
    position_y: int            # 段位置
    allocated_date: date
    is_current: bool = True


@dataclass
class PlanogramPerformance:
    """プラノグラム効果測定"""
    performance_id: str
    fixture_id: str
    shelf_zone: ShelfZone
    sku_id: str
    period_start: date
    period_end: date
    units_sold: int
    revenue: float
    profit: float
    revenue_per_face: float     # フェイス当たり売上
    stock_turn_rate: float      # 回転率
    out_of_stock_days: int      # 欠品日数
    customer_touch_count: int   # 手に取り回数（センサー計測想定）
