// ============================================================
// Prompt Market — 전체 타입 정의 v2.0
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  productCount?: number;
}

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type PromptStatus = "pending" | "approved" | "rejected" | "hidden";
export type ResultType = "image" | "text" | "audio" | "video";

export interface Creator {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  socialLinks: Record<string, string>;
  totalSales: number;
  totalRevenue: number;
  ratingAvg: number;
  reviewCount: number;
  followerCount: number;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface PromptSample {
  id: string;
  promptId: string;
  sampleText: string;
  sortOrder: number;
}

export interface PromptResult {
  id: string;
  promptId: string;
  resultType: ResultType;
  resultUrl: string;
  caption?: string;
  aiModelUsed?: string;
  createdAt: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: string;
  changelog?: string;
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  creatorId?: string;
  creator?: Creator;
  categoryId?: string;
  category?: Category;
  aiTools: string[];
  difficulty: Difficulty;
  promptCount: number;
  previewImageUrl: string;
  tags: string[];
  version: string;
  isFeatured: boolean;
  isFree: boolean;
  isBundle: boolean;
  isLimitedDrop: boolean;
  stockLimit?: number;
  stockRemaining?: number;
  status: PromptStatus;
  salesCount: number;
  ratingAvg: number;
  reviewCount: number;
  fileUrls: string[];
  fileFormat?: string;
  usageTips?: string[];
  exampleResults?: string[];
  externalBuyUrl?: string;
  stripePriceId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  samples?: PromptSample[];
  results?: PromptResult[];
  versions?: PromptVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  promptId: string;
  orderId?: string;
  rating: number;
  content: string;
  authorName?: string;
  authorRole?: string;
  isVerified?: boolean;
  aiModelUsed?: string;
  resultQuality?: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: {
    displayName: string;
    avatarUrl?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  promptId: string;
  prompt?: Pick<Prompt, "id" | "title" | "slug" | "previewImageUrl" | "price">;
  amount: number;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: "stripe" | "external";
  stripeSessionId?: string;
  downloadToken?: string;
  downloadCount: number;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  promptId: string;
  prompt?: Prompt;
  createdAt: string;
}

export interface Bundle {
  id: string;
  promptId: string;
  includedPromptIds: string[];
  discountPercent: number;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId?: string;
  promptId: string;
  reportType: "fake" | "duplicate" | "broken" | "spam";
  description?: string;
  status: "pending" | "reviewed" | "dismissed";
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId?: string;
  status: "active" | "cancelled" | "past_due" | "trialing";
  plan: string;
  currentPeriodEnd?: string;
  createdAt: string;
}

export interface PlaygroundResult {
  content: string;
  model: string;
  usedAt: string;
  promptId: string;
  remainingToday: number;
}

export interface AIQualityScore {
  clarity: number;
  structure: number;
  stability: number;
  aiCompatibility: number;
  overall: number;
  feedback: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  aiTool?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  difficulty?: Difficulty;
  isFree?: boolean;
  tags?: string[];
}

export type SortOption =
  | "popular"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating";

export interface Comment {
  id: string;
  userId: string;
  promptId: string;
  content: string;
  isDeleted?: boolean;
  createdAt: string;
  user?: {
    displayName: string;
    avatarUrl?: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: "update" | "notice" | "event";
  isPinned: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  promptSlugs: string[];
  coverImageUrl?: string;
}

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  improvements: string[];
  qualityScore: AIQualityScore;
}

export type LicenseType = "personal" | "commercial" | "extended";

// 레거시 호환 (기존 코드 유지용)
export type Product = Prompt;
export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl?: string;
  rating: number;
};
