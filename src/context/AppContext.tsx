'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  City,
  Profile,
  ProviderProfile,
  StoreProfile,
  SubscriptionPayment,
  Review,
  PortfolioItem,
  StoreOffer,
} from '@/types';
import {
  DEMO_CITIES,
  DEMO_CATEGORIES,
  DEMO_PROVIDERS,
  DEMO_STORES,
  DEMO_PAYMENTS,
  DEMO_ADMIN_USER,
} from '@/lib/demo-data';

interface AppContextType {
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: City[];
  categories: Category[];
  providers: ProviderProfile[];
  stores: StoreProfile[];
  payments: SubscriptionPayment[];
  registerClick: (targetId: string, eventType: 'whatsapp_click' | 'profile_view' | 'banner_click') => void;
  toggleProviderVerified: (providerId: string) => void;
  addProviderDays: (providerId: string, days?: number) => void;
  toggleProviderBlocked: (providerId: string) => void;
  deleteProvider: (providerId: string) => void;
  confirmPayment: (paymentId: string) => void;
  addReview: (providerId: string, review: Omit<Review, 'id' | 'createdAt' | 'isApproved' | 'providerId'>) => void;
  deleteReview: (reviewId: string) => void;
  addPortfolioItem: (providerId: string, item: Omit<PortfolioItem, 'id' | 'createdAt' | 'providerId'>) => void;
  deletePortfolioItem: (providerId: string, itemId: string) => void;
  updateProviderProfile: (providerId: string, updates: Partial<ProviderProfile>) => void;
  addStoreOffer: (storeId: string, offer: Omit<StoreOffer, 'id' | 'createdAt' | 'storeId'>) => void;
  deleteStoreOffer: (storeId: string, offerId: string) => void;
  activeRole: 'customer' | 'provider' | 'store' | 'admin';
  switchRole: (role: 'customer' | 'provider' | 'store' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Todas as Cidades');
  const [currentUser, setCurrentUser] = useState<Profile | null>(DEMO_ADMIN_USER);
  const [providers, setProviders] = useState<ProviderProfile[]>(DEMO_PROVIDERS);
  const [stores, setStores] = useState<StoreProfile[]>(DEMO_STORES);
  const [payments, setPayments] = useState<SubscriptionPayment[]>(DEMO_PAYMENTS);
  const [cities] = useState<City[]>(DEMO_CITIES);
  const [categories] = useState<Category[]>(DEMO_CATEGORIES);

  // Carregar dados salvos no localStorage para persistir ações na sessão
  useEffect(() => {
    try {
      const savedProviders = localStorage.getItem('tnm_providers');
      if (savedProviders) setProviders(JSON.parse(savedProviders));

      const savedStores = localStorage.getItem('tnm_stores');
      if (savedStores) setStores(JSON.parse(savedStores));

      const savedPayments = localStorage.getItem('tnm_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedCity = localStorage.getItem('tnm_city');
      if (savedCity) setSelectedCity(savedCity);

      const savedUser = localStorage.getItem('tnm_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch {
      // Ignore local storage errors
    }
  }, []);

  const saveProviders = (updated: ProviderProfile[]) => {
    setProviders(updated);
    try {
      localStorage.setItem('tnm_providers', JSON.stringify(updated));
    } catch {}
  };

  const saveStores = (updated: StoreProfile[]) => {
    setStores(updated);
    try {
      localStorage.setItem('tnm_stores', JSON.stringify(updated));
    } catch {}
  };

  const savePayments = (updated: SubscriptionPayment[]) => {
    setPayments(updated);
    try {
      localStorage.setItem('tnm_payments', JSON.stringify(updated));
    } catch {}
  };

  const handleSetSelectedCity = (city: string) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('tnm_city', city);
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

  const confirmPayment = (paymentId: string) => {
    const updatedPayments = payments.map((pay) =>
      pay.id === paymentId ? { ...pay, status: 'paid' as const, paidAt: new Date().toISOString() } : pay
    );
    savePayments(updatedPayments);

    // Se o pagamento for de um profissional, renova a assinatura dele
    const targetPay = payments.find((p) => p.id === paymentId);
    if (targetPay) {
      const targetProv = providers.find((pr) => pr.userId === targetPay.userId);
      if (targetProv) {
        addProviderDays(targetProv.id, 30);
      }
    }
  };

  const addReview = (providerId: string, review: Omit<Review, 'id' | 'createdAt' | 'isApproved' | 'providerId'>) => {
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

  const addPortfolioItem = (providerId: string, item: Omit<PortfolioItem, 'id' | 'createdAt' | 'providerId'>) => {
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

  const addStoreOffer = (storeId: string, offer: Omit<StoreOffer, 'id' | 'createdAt' | 'storeId'>) => {
    const newOffer: StoreOffer = {
      ...offer,
      storeId,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = stores.map((s) =>
      s.id === storeId ? { ...s, offers: [newOffer, ...s.offers] } : s
    );
    saveStores(updated);
  };

  const deleteStoreOffer = (storeId: string, offerId: string) => {
    const updated = stores.map((s) =>
      s.id === storeId ? { ...s, offers: s.offers.filter((o) => o.id !== offerId) } : s
    );
    saveStores(updated);
  };

  const switchRole = (role: 'customer' | 'provider' | 'store' | 'admin') => {
    let newUser: Profile | null = null;
    if (role === 'admin') {
      newUser = DEMO_ADMIN_USER;
    } else if (role === 'provider') {
      const p = providers[1]; // Marcos Eletricista (em Trial)
      newUser = {
        id: p.userId,
        role: 'provider',
        fullName: p.fullName,
        email: 'marcos.eletricista@gmail.com',
        phoneWhatsapp: p.phoneWhatsapp,
        avatarUrl: p.avatarUrl,
        city: p.baseCity,
        state: 'SP',
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
        city: s.city,
        state: 'SP',
        isBlocked: false,
        createdAt: s.createdAt,
      };
    } else {
      newUser = null; // Visitante
    }
    setCurrentUser(newUser);
    try {
      localStorage.setItem('tnm_user', JSON.stringify(newUser));
    } catch {}
  };

  const activeRole: 'customer' | 'provider' | 'store' | 'admin' =
    currentUser?.role || 'customer';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        selectedCity,
        setSelectedCity: handleSetSelectedCity,
        cities,
        categories,
        providers,
        stores,
        payments,
        registerClick,
        toggleProviderVerified,
        addProviderDays,
        toggleProviderBlocked,
        deleteProvider,
        confirmPayment,
        addReview,
        deleteReview,
        addPortfolioItem,
        deletePortfolioItem,
        updateProviderProfile,
        addStoreOffer,
        deleteStoreOffer,
        activeRole,
        switchRole,
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
