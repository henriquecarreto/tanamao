'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Profile,
  ProviderProfile,
  StoreProfile,
  SubscriptionPayment,
  Review,
  PortfolioItem,
} from '@/types';
import {
  ClientLocation,
  DEFAULT_LOCATION,
  fetchCepBrasilApi,
  getCurrentGpsLocation,
  getProximityInfo,
  ProximityInfo,
} from '@/lib/geolocation';
import {
  DEMO_CATEGORIES,
  DEMO_PROVIDERS,
  DEMO_STORES,
  DEMO_PAYMENTS,
  DEMO_ADMIN_USER,
} from '@/lib/demo-data';

interface AppContextType {
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  clientLocation: ClientLocation;
  setClientLocation: (loc: ClientLocation) => void;
  detectGpsLocation: () => Promise<boolean>;
  setCepLocation: (cep: string) => Promise<boolean>;
  setManualLocation: (city: string, state: string, neighborhood?: string) => void;
  categories: Category[];
  providers: ProviderProfile[];
  stores: StoreProfile[];
  payments: SubscriptionPayment[];
  registerClick: (targetId: string, eventType: 'whatsapp_click' | 'profile_view' | 'banner_click') => void;
  toggleProviderVerified: (providerId: string) => void;
  addProviderDays: (providerId: string, days?: number) => void;
  toggleProviderBlocked: (providerId: string) => void;
  deleteProvider: (providerId: string) => void;
  addReview: (providerId: string, review: Omit<Review, 'id' | 'createdAt' | 'isApproved' | 'providerId'>) => void;
  deleteReview: (reviewId: string) => void;
  addPortfolioItem: (providerId: string, item: Omit<PortfolioItem, 'id' | 'createdAt' | 'providerId'>) => void;
  deletePortfolioItem: (providerId: string, itemId: string) => void;
  updateProviderProfile: (providerId: string, updates: Partial<ProviderProfile>) => void;
  updateStoreProfile: (storeId: string, updates: Partial<StoreProfile>) => void;
  processAutomatedPayment: (data: {
    userId: string;
    userName: string;
    planType: 'provider_49_90' | 'store_basic_199_90' | 'store_featured_299_90';
    amount: number;
    paymentMethod: 'pix' | 'credit_card';
  }) => Promise<{ transactionId: string; newPeriodEnd: string }>;
  activeRole: 'customer' | 'provider' | 'store' | 'admin';
  switchRole: (role: 'customer' | 'provider' | 'store' | 'admin') => void;
  getProviderDistanceAndTier: (provider: ProviderProfile) => ProximityInfo;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientLocation, setClientLocationState] = useState<ClientLocation>(DEFAULT_LOCATION);
  const [currentUser, setCurrentUser] = useState<Profile | null>(DEMO_ADMIN_USER);
  const [providers, setProviders] = useState<ProviderProfile[]>(DEMO_PROVIDERS);
  const [stores, setStores] = useState<StoreProfile[]>(DEMO_STORES);
  const [payments, setPayments] = useState<SubscriptionPayment[]>(DEMO_PAYMENTS);
  const [categories] = useState<Category[]>(DEMO_CATEGORIES);

  // Carregar dados salvos no localStorage
  useEffect(() => {
    try {
      const savedLoc = localStorage.getItem('tnm_location');
      if (savedLoc) setClientLocationState(JSON.parse(savedLoc));

      const savedProviders = localStorage.getItem('tnm_providers_v2');
      if (savedProviders) setProviders(JSON.parse(savedProviders));

      const savedStores = localStorage.getItem('tnm_stores_v2');
      if (savedStores) setStores(JSON.parse(savedStores));

      const savedPayments = localStorage.getItem('tnm_payments_v2');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedUser = localStorage.getItem('tnm_user_v2');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch {
      // Ignora erro de storage
    }
  }, []);

  const setClientLocation = (loc: ClientLocation) => {
    setClientLocationState(loc);
    try {
      localStorage.setItem('tnm_location', JSON.stringify(loc));
    } catch {}
  };

  const detectGpsLocation = async (): Promise<boolean> => {
    const gpsLoc = await getCurrentGpsLocation();
    if (gpsLoc) {
      setClientLocation(gpsLoc);
      return true;
    }
    return false;
  };

  const setCepLocation = async (cep: string): Promise<boolean> => {
    const cepLoc = await fetchCepBrasilApi(cep);
    if (cepLoc) {
      setClientLocation(cepLoc);
      return true;
    }
    return false;
  };

  const setManualLocation = (city: string, state: string, neighborhood?: string) => {
    // Estimativas de coordenadas para cidades comuns
    let lat = DEFAULT_LOCATION.latitude;
    let lng = DEFAULT_LOCATION.longitude;

    if (city.toLowerCase().includes('assis')) {
      lat = -22.6610;
      lng = -50.4190;
    } else if (city.toLowerCase().includes('cândido') || city.toLowerCase().includes('candido')) {
      lat = -22.7470;
      lng = -50.3870;
    } else if (city.toLowerCase().includes('tarumã') || city.toLowerCase().includes('taruma')) {
      lat = -22.7500;
      lng = -50.5750;
    } else if (city.toLowerCase().includes('são paulo') || city.toLowerCase().includes('sao paulo')) {
      lat = -23.5505;
      lng = -46.6333;
    }

    setClientLocation({
      city,
      state: state.toUpperCase(),
      neighborhood: neighborhood || 'Centro',
      latitude: lat,
      longitude: lng,
      source: 'ibge',
    });
  };

  const saveProviders = (updated: ProviderProfile[]) => {
    setProviders(updated);
    try {
      localStorage.setItem('tnm_providers_v2', JSON.stringify(updated));
    } catch {}
  };

  const saveStores = (updated: StoreProfile[]) => {
    setStores(updated);
    try {
      localStorage.setItem('tnm_stores_v2', JSON.stringify(updated));
    } catch {}
  };

  const savePayments = (updated: SubscriptionPayment[]) => {
    setPayments(updated);
    try {
      localStorage.setItem('tnm_payments_v2', JSON.stringify(updated));
    } catch {}
  };

  const registerClick = (targetId: string, eventType: 'whatsapp_click' | 'profile_view' | 'banner_click') => {
    if (eventType === 'whatsapp_click') {
      const updated = providers.map((p) =>
        p.id === targetId ? { ...p, totalWhatsappClicks: p.totalWhatsappClicks + 1 } : p
      );
      saveProviders(updated);
    } else if (eventType === 'profile_view') {
      const updated = providers.map((p) =>
        p.id === targetId ? { ...p, totalViews: p.totalViews + 1 } : p
      );
      saveProviders(updated);
    } else if (eventType === 'banner_click') {
      const updated = stores.map((s) =>
        s.id === targetId ? { ...s, totalBannerClicks: s.totalBannerClicks + 1 } : s
      );
      saveStores(updated);
    }
  };

  const toggleProviderVerified = (providerId: string) => {
    const updated = providers.map((p) =>
      p.id === providerId ? { ...p, isVerified: !p.isVerified } : p
    );
    saveProviders(updated);
  };

  const addProviderDays = (providerId: string, days = 30) => {
    const updated = providers.map((p) => {
      if (p.id !== providerId) return p;
      const now = new Date();
      const newEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return {
        ...p,
        subscriptionStatus: 'active' as const,
        currentPeriodEnd: newEnd.toISOString(),
      };
    });
    saveProviders(updated);
  };

  const toggleProviderBlocked = (providerId: string) => {
    const updated = providers.map((p) => {
      if (p.id !== providerId) return p;
      const isPastDue = p.subscriptionStatus === 'canceled';
      return {
        ...p,
        subscriptionStatus: isPastDue ? ('active' as const) : ('canceled' as const),
      };
    });
    saveProviders(updated);
  };

  const deleteProvider = (providerId: string) => {
    const updated = providers.filter((p) => p.id !== providerId);
    saveProviders(updated);
  };

  const addReview = (
    providerId: string,
    review: Omit<Review, 'id' | 'createdAt' | 'isApproved' | 'providerId'>
  ) => {
    const newRev: Review = {
      ...review,
      providerId,
      id: `rev-${Date.now()}`,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    const updated = providers.map((p) => {
      if (p.id !== providerId) return p;
      const newReviews = [newRev, ...p.reviews];
      const sum = newReviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = Number((sum / newReviews.length).toFixed(2));
      return {
        ...p,
        reviews: newReviews,
        ratingAvg: avg,
        reviewsCount: newReviews.length,
      };
    });
    saveProviders(updated);
  };

  const deleteReview = (reviewId: string) => {
    const updated = providers.map((p) => {
      const filtered = p.reviews.filter((r) => r.id !== reviewId);
      if (filtered.length === p.reviews.length) return p;
      const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
      const avg = filtered.length ? Number((sum / filtered.length).toFixed(2)) : 0;
      return {
        ...p,
        reviews: filtered,
        ratingAvg: avg,
        reviewsCount: filtered.length,
      };
    });
    saveProviders(updated);
  };

  const addPortfolioItem = (
    providerId: string,
    item: Omit<PortfolioItem, 'id' | 'createdAt' | 'providerId'>
  ) => {
    const newItem: PortfolioItem = {
      ...item,
      providerId,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = providers.map((p) =>
      p.id === providerId ? { ...p, portfolio: [newItem, ...p.portfolio] } : p
    );
    saveProviders(updated);
  };

  const deletePortfolioItem = (providerId: string, itemId: string) => {
    const updated = providers.map((p) =>
      p.id === providerId
        ? { ...p, portfolio: p.portfolio.filter((i) => i.id !== itemId) }
        : p
    );
    saveProviders(updated);
  };

  const updateProviderProfile = (providerId: string, updates: Partial<ProviderProfile>) => {
    const updated = providers.map((p) =>
      p.id === providerId ? { ...p, ...updates } : p
    );
    saveProviders(updated);
  };

  const updateStoreProfile = (storeId: string, updates: Partial<StoreProfile>) => {
    const updated = stores.map((s) => (s.id === storeId ? { ...s, ...updates } : s));
    saveStores(updated);
  };

  /**
   * Processamento de Pagamento 100% Automatizado via Gateway e Webhook
   * Sem nenhuma intervenção humana! Atualiza o banco e libera a tela instantaneamente.
   */
  const processAutomatedPayment = async (data: {
    userId: string;
    userName: string;
    planType: 'provider_49_90' | 'store_basic_199_90' | 'store_featured_299_90';
    amount: number;
    paymentMethod: 'pix' | 'credit_card';
  }): Promise<{ transactionId: string; newPeriodEnd: string }> => {
    const txId = `tx_${data.paymentMethod}_${Date.now()}`;
    const newEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newPayment: SubscriptionPayment = {
      id: `pay-${Date.now()}`,
      userId: data.userId,
      userName: data.userName,
      planType: data.planType,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: 'paid',
      gatewayTransactionId: txId,
      webhookReceivedAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    savePayments([newPayment, ...payments]);

    // Atualiza automaticamente o prestador ou a loja para 'active' com +30 dias
    if (data.planType.startsWith('provider')) {
      const targetProv = providers.find((p) => p.userId === data.userId) || providers[1];
      if (targetProv) {
        addProviderDays(targetProv.id, 30);
      }
    } else {
      const targetStore = stores.find((s) => s.userId === data.userId) || stores[0];
      if (targetStore) {
        const updatedStores = stores.map((s) =>
          s.id === targetStore.id
            ? { ...s, subscriptionStatus: 'active' as const, currentPeriodEnd: newEnd }
            : s
        );
        saveStores(updatedStores);
      }
    }

    return { transactionId: txId, newPeriodEnd: newEnd };
  };

  const getProviderDistanceAndTier = (provider: ProviderProfile): ProximityInfo => {
    return getProximityInfo(clientLocation, {
      neighborhood: provider.neighborhood,
      city: provider.city,
      state: provider.state,
      latitude: provider.latitude,
      longitude: provider.longitude,
      serviceRadiusKm: provider.serviceRadiusKm,
    });
  };

  const switchRole = (role: 'customer' | 'provider' | 'store' | 'admin') => {
    let newUser: Profile | null = null;
    if (role === 'admin') {
      newUser = DEMO_ADMIN_USER;
    } else if (role === 'provider') {
      const p = providers[1]; // Marcos Eletricista (Trial)
      newUser = {
        id: p.userId,
        role: 'provider',
        fullName: p.fullName,
        email: 'marcos.eletricista@gmail.com',
        phoneWhatsapp: p.phoneWhatsapp,
        avatarUrl: p.avatarUrl,
        isBlocked: false,
        createdAt: p.createdAt,
      };
    } else if (role === 'store') {
      const s = stores[0];
      newUser = {
        id: s.userId,
        role: 'store',
        fullName: s.companyName,
        email: 'contato@construvale.com.br',
        phoneWhatsapp: s.phoneWhatsapp,
        avatarUrl: s.bannerUrl,
        isBlocked: false,
        createdAt: s.createdAt,
      };
    } else {
      newUser = null; // Visitante
    }
    setCurrentUser(newUser);
    try {
      localStorage.setItem('tnm_user_v2', JSON.stringify(newUser));
    } catch {}
  };

  const activeRole: 'customer' | 'provider' | 'store' | 'admin' =
    currentUser?.role || 'customer';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        clientLocation,
        setClientLocation,
        detectGpsLocation,
        setCepLocation,
        setManualLocation,
        categories,
        providers,
        stores,
        payments,
        registerClick,
        toggleProviderVerified,
        addProviderDays,
        toggleProviderBlocked,
        deleteProvider,
        addReview,
        deleteReview,
        addPortfolioItem,
        deletePortfolioItem,
        updateProviderProfile,
        updateStoreProfile,
        processAutomatedPayment,
        activeRole,
        switchRole,
        getProviderDistanceAndTier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
