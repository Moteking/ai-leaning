export type UserRole = "advertiser" | "affiliate";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  userId: string;
  tiktokHandle: string;
  tiktokUrl: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  categories: string[];
  region: string;
  bio: string;
  avatarUrl: string;
  monthlyGmv: number;
  affiliateScore: number;
  verifiedAt: string | null;
  recentVideos: TikTokVideo[];
  stats: AffiliateStats;
}

export interface TikTokVideo {
  id: string;
  thumbnailUrl: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
  productLink?: string;
}

export interface AffiliateStats {
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  avgOrderValue: number;
  monthlyGrowth: number;
}

export interface Campaign {
  id: string;
  advertiserId: string;
  title: string;
  description: string;
  productName: string;
  productUrl: string;
  productImageUrl: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  budget: number;
  spent: number;
  status: "draft" | "active" | "paused" | "completed";
  categories: string[];
  targetRegion: string;
  startDate: string;
  endDate: string;
  applicants: CampaignApplication[];
  createdAt: string;
}

export interface CampaignApplication {
  id: string;
  campaignId: string;
  affiliateId: string;
  affiliate?: Affiliate;
  status: "pending" | "approved" | "rejected";
  message: string;
  appliedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
  maxCampaigns: number;
  maxAffiliates: number;
}
