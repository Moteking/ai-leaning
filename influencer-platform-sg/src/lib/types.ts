export type UserRole = "brand" | "creator";

export type SocialPlatform = "instagram" | "tiktok" | "youtube" | "xiaohongshu";

export interface Creator {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  city: string;
  languages: string[];
  categories: string[];
  platforms: {
    platform: SocialPlatform;
    handle: string;
    followers: number;
    url: string;
  }[];
  rateCardSGD: {
    instagramPost?: number;
    instagramReel?: number;
    instagramStory?: number;
    tiktokVideo?: number;
    youtubeVideo?: number;
    youtubeShort?: number;
  };
  tags: string[];
  verified: boolean;
  completedCampaigns: number;
  averageRating: number;
  joinedDate: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  description: string;
  briefMarkdown: string;
  productName: string;
  deliverables: Deliverable[];
  budgetSGD: number;
  paymentPerCreatorSGD: number;
  status: "draft" | "open" | "in_progress" | "completed" | "cancelled";
  categories: string[];
  platforms: SocialPlatform[];
  targetCity: string;
  minFollowers: number;
  maxFollowers: number;
  applicationDeadline: string;
  contentDeadline: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  applicants: Application[];
  selectedCreators: string[];
}

export interface Deliverable {
  type: "instagram_post" | "instagram_reel" | "instagram_story" | "tiktok_video" | "youtube_video" | "youtube_short";
  quantity: number;
  requirements: string;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorHandle?: string;
  message: string;
  proposedRate?: number;
  status: "pending" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  appliedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceSGD: number;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}
