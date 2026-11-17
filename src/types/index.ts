export type UserRole = 'customer' | 'provider' | 'store' | 'admin';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
export type PaymentMethod = 'pix' | 'credit_card' | 'manual_admin';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type EventType = 'profile_view' | 'whatsapp_click' | 'banner_click';

export interface City {
  id: number;
  name: string;
  state: string;
  slug: string;
  isActive: boolean;
}

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
  city: string;
  state: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  phoneWhatsapp: string;
  baseCity: string;
  state: string;
  bio: string;
  yearsExperience: number;
  citiesServed: string[];
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

export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
}

export interface StoreOffer {
  id: string;
  storeId: string;
  productName: string;
  originalPrice?: number;
  promotionalPrice: number;
  imageUrl?: string;
  validUntil?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StoreProfile {
  id: string;
  userId: string;
  companyName: string;
  cnpj?: string;
  phoneWhatsapp: string;
  address: string;
  city: string;
  state: string;
  bannerUrl: string;
  citiesTargeted: string[];
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  currentPeriodEnd?: string;
  planPrice: number;
  totalBannerClicks: number;
  offers: StoreOffer[];
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

export interface SubscriptionPayment {
  id: string;
  userId: string;
  userName: string;
  planType: 'autonomo_49_90' | 'empresa_249_90';
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  pixQrCode?: string;
  pixCopyPaste?: string;
  paidAt?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  targetId: string;
  eventType: EventType;
  viewerCity?: string;
  createdAt: string;
}
