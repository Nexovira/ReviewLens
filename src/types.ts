export type PlanTier = 'Starter' | 'Growth' | 'Pro';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  storeName?: string;
  planTier: PlanTier;
  createdAt: string;
}

export function isPlatformOwner(user?: UserProfile | null): boolean {
  if (!user || !user.email) return false;
  const lower = user.email.toLowerCase().trim();
  return lower.includes('ummuunaysah');
}

export interface StrengthComplaint {
  id: string;
  title: string;
  category: string;
  percentage: number;
  summary: string;
  quotes: string[];
}

export interface FeatureMention {
  feature: string;
  positive: number;
  negative: number;
  totalCount: number;
}

export interface CompetitorMention {
  competitorName: string;
  mentionCount: number;
  sentiment: string;
  quote: string;
  context: string;
}

export interface ActionItem {
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  impact: string;
  completed?: boolean;
}

export interface ReplyTemplate {
  id: string;
  targetReviewRating: number;
  issueFocus: string;
  sampleReviewQuote: string;
  suggestedReply: string;
}

export interface RatingDistribution {
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
}

export interface AnalysisResult {
  overallSentimentScore: number;
  summaryHeadline: string;
  totalReviewsAnalyzed: number;
  ratingDistribution: RatingDistribution;
  strengths: StrengthComplaint[];
  complaints: StrengthComplaint[];
  featureMentions: FeatureMention[];
  competitorMentions: CompetitorMention[];
  actionPlan: ActionItem[];
  replyTemplates: ReplyTemplate[];
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  asinOrUrl: string;
  category: string;
  createdAt: string;
  lastAnalyzedAt: string;
  reviewCount: number;
  rawReviewCorpus: string;
  latestAnalysis: AnalysisResult;
}

export interface CompetitorComparison {
  mainSentimentScore: number;
  competitorSentimentScore: number;
  keyDiffSummary: string;
  mainAdvantages: string[];
  competitorAdvantages: string[];
  featureComparison: {
    feature: string;
    mainScore: number;
    competitorScore: number;
  }[];
}

export interface ReportSnapshot {
  id: string;
  productId: string;
  productName: string;
  analyzedAt: string;
  sentimentScore: number;
  reviewsCount: number;
  analysis: AnalysisResult;
}

export interface ManualReviewEntry {
  id: string;
  rating: number;
  title: string;
  text: string;
  author?: string;
  date?: string;
}
