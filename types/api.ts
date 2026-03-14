// API 요청/응답 타입

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PlaygroundRequest {
  promptId: string;
  sampleText: string;
  userInput?: string;
}

export interface PlaygroundResponse {
  content: string;
  model: string;
  remainingToday: number;
}

export interface QualityAnalyzeRequest {
  promptTexts: string[];
  title?: string;
  aiTools?: string[];
}

export interface QualityAnalyzeResponse {
  clarity: number;
  structure: number;
  stability: number;
  aiCompatibility: number;
  overall: number;
  feedback: string;
}

export interface TagGenerateRequest {
  title: string;
  description: string;
  aiTools?: string[];
}

export interface TagGenerateResponse {
  tags: string[];
}

export interface SEOGenerateRequest {
  title: string;
  description: string;
  tags?: string[];
}

export interface SEOGenerateResponse {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export interface ReviewCreateRequest {
  promptId: string;
  orderId?: string;
  rating: number;
  content: string;
  aiModelUsed?: string;
  resultQuality?: number;
}

export interface FavoriteToggleResponse {
  isFavorited: boolean;
}

export interface ReportCreateRequest {
  promptId: string;
  reportType: "fake" | "duplicate" | "broken" | "spam";
  description?: string;
}
