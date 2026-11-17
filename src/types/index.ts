export type UserRole = 'customer' | 'provider' | 'store' | 'admin';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
export type PaymentMethod = 'pix' | 'credit_card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type EventType = 'profile_view' | 'whatsapp_click' | 'banner_click';

export interface Category {
  id: number;
  name: string;
  slug: string;
  iconName: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  avatarUrl?: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
}

export interface Review {
  id: string;
  providerId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  serviceHired?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  phoneWhatsapp: string;
  bio: string;
  yearsExperience: number;
  cep: string;
  street?: string;
  neighborhood: string;
  city: string;
  state: string; // Ex: 'SP'
  ibgeCode?: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  categories: Category[];
  isVerified: boolean;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string;
  currentPeriodEnd?: string;
  planPrice: number;
  ratingAvg: number;
  reviewsCount: number;
  totalViews: number;
  totalWhatsappClicks: number;
  portfolio: PortfolioItem[];
  reviews: Review[];
  createdAt: string;
}

export interface StoreProfile {
  id: string;
  userId: string;
  companyName: string;
  cnpj?: string;
  description: string;
  phoneWhatsapp: string;
  cep: string;
  street?: string;
  neighborhood?: string;
  city: string;
  state: string; // Ex: 'SP'
  latitude: number;
  longitude: number;
  coverageRadiusKm: number;
  bannerUrl: string;
  planTier: 'basic_199_90' | 'featured_299_90';
  planPrice: number;
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  currentPeriodEnd?: string;
  totalBannerClicks: number;
  totalWhatsappClicks: number;
  createdAt: string;
}

export interface SubscriptionPayment {
  id: string;
  userId: string;
  userName: string;
  planType: 'provider_49_90' | 'store_basic_199_90' | 'store_featured_299_90';
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  pixQrCodeBase64?: string;
  pixCopyPaste?: string;
  webhookReceivedAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  targetId: string;
  eventType: EventType;
  viewerCity?: string;
  viewerState?: string;
  createdAt: string;
}
