'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProviderCard } from '@/components/ProviderCard';
import { StoreBanner } from '@/components/StoreBanner';
import { LocationModal } from '@/components/LocationModal';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Navigation,
  HardHat,
  Crosshair,
} from 'lucide-react';

function ExplorarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    providers,
    stores,
    categories,
    clientLocation,
    getProviderDistanceAndTier,
    detectGpsLocation,
    currentUser,
    isLoadingSession,
  } = useApp();

  // Proteção da Área Logada: se não tiver sessão, redireciona para /login
  useEffect(() => {
    if (!isLoadingSession && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoadingSession, router]);

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience'>('distance');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setKeyword(q);

    const cat = searchParams.get('cat');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-bold text-xs animate-pulse">Carregando área logada...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Filtragem e classificação geolocalizada em cascata
  const filteredProviders = useMemo(() => {
    return providers
      .filter((p) => p.subscriptionStatus === 'trialing' || p.subscriptionStatus === 'active')
      .map((p) => ({
        ...p,
        proximity: getProviderDistanceAndTier(p),
      }))
      .filter((p) => {
        // 1. Filtro de raio máximo
        if (maxRadiusKm > 0 && p.proximity.distanceKm > maxRadiusKm) return false;

        // 2. Filtro de Categoria
        if (selectedCategory !== 'todas') {
          const matchesCat = p.categories.some(
            (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase()
          );
          if (!matchesCat) return false;
        }

        // 3. Busca textual
        if (keyword.trim()) {
          const term = keyword.toLowerCase();
          const inName = p.fullName.toLowerCase().includes(term);
          const inBio = p.bio.toLowerCase().includes(term);
          const inNeighborhood = p.neighborhood.toLowerCase().includes(term);
          const inCity = p.city.toLowerCase().includes(term);
          const inCat = p.categories.some((c) => c.name.toLowerCase().includes(term));
          if (!inName && !inBio && !inNeighborhood && !inCity && !inCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          if (a.proximity.tier !== b.proximity.tier) {
            return a.proximity.tier - b.proximity.tier;
          }
          return a.proximity.distanceKm - b.proximity.distanceKm;
        }
        if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
        if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
        return 0;
      });
  }, [providers, clientLocation, maxRadiusKm, selectedCategory, keyword, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header com resumo da busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Busca Geolocalizada de Profissionais
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {filteredProviders.length} profissional(is) encontrado(s) a partir de{' '}
            <strong className="text-slate-800">
              {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
              {clientLocation.city} - {clientLocation.state}
            </strong>
          </p>
        </div>

        <button
          onClick={() => setLocationModalOpen(true)}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4" />
          <span>Trocar Localização (GPS / CEP)</span>
        </button>
      </div>

      {/* BANNER INSTITUCIONAL NO TOPO */}
      {stores.length > 0 && (
        <div className="mb-8">
          <StoreBanner store={stores[0]} />
        </div>
      )}

      {/* Grid Principal: Filtros + Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR DE FILTROS AVANÇADOS */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Filtros & Proximidade
              </span>
              <button
                onClick={() => {
                  setKeyword('');
                  setSelectedCategory('todas');
                  setMaxRadiusKm(50);
                  setSortBy('distance');
                }}
                className="text-[11px] text-amber-600 font-bold hover:underline"
              >
                Limpar
              </button>
            </div>

            {/* Busca textual */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                Palavra-chave ou Nome
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: Alvenaria, Elétrica, Fachada"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Raio Máximo em KM */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Raio Máximo de Distância
                </label>
                <span className="text-xs font-black text-amber-600">
                  {maxRadiusKm === 0 ? 'Ilimitado' : `até ${maxRadiusKm} km`}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                step="5"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2 km (Bairro)</span>
                <span>15 km (Cidade)</span>
                <span>100 km (Região)</span>
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                Especialidade
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="todas">Todas as Especialidades</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                Critério de Ordenação
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="distance">📍 Mais Próximos de Mim (Cascata GPS)</option>
                <option value="rating">★ Mais Bem Avaliados (Nota 5.0)</option>
                <option value="experience">⏳ Mais Experientes (Anos de Obra)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* LISTAGEM DE RESULTADOS */}
        <section className="lg:col-span-3">
          {filteredProviders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <HardHat className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Nenhum profissional encontrado com esse raio de distância
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Tente aumentar o raio para 60 km ou selecionar outra especialidade.
              </p>
              <button
                onClick={() => {
                  setMaxRadiusKm(100);
                  setSelectedCategory('todas');
                  setKeyword('');
                }}
                className="inline-block bg-slate-900 text-amber-400 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                Expandir Raio para 100 km
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((prov) => (
                <ProviderCard key={prov.id} provider={prov} />
              ))}
            </div>
          )}
        </section>
      </div>

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Calculando distâncias por GPS...</div>}>
          <ExplorarContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
