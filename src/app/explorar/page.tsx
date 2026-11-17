'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProviderCard } from '@/components/ProviderCard';
import { StoreBanner } from '@/components/StoreBanner';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Building2,
  HardHat,
  Filter,
} from 'lucide-react';

function ExplorarContent() {
  const searchParams = useSearchParams();
  const { providers, stores, cities, categories } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas as Cidades');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'views'>('rating');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setKeyword(q);

    const cidade = searchParams.get('cidade');
    if (cidade) setSelectedCity(cidade);

    const cat = searchParams.get('cat');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Regra de exibição pública: Apenas profissionais com trial válido ou active
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // 1. Trava de assinatura
      const isValidSub =
        p.subscriptionStatus === 'trialing' || p.subscriptionStatus === 'active';
      if (!isValidSub) return false;

      // 2. Filtro de Cidade
      if (selectedCity !== 'Todas as Cidades') {
        const matchesCity =
          p.baseCity.toLowerCase() === selectedCity.toLowerCase() ||
          p.citiesServed.some((c) => c.toLowerCase() === selectedCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // 3. Filtro de Categoria
      if (selectedCategory !== 'todas') {
        const matchesCat = p.categories.some(
          (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCat) return false;
      }

      // 4. Busca textual
      if (keyword.trim()) {
        const term = keyword.toLowerCase();
        const inName = p.fullName.toLowerCase().includes(term);
        const inBio = p.bio.toLowerCase().includes(term);
        const inCat = p.categories.some((c) => c.name.toLowerCase().includes(term));
        if (!inName && !inBio && !inCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
      if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
      if (sortBy === 'views') return b.totalViews - a.totalViews;
      return 0;
    });
  }, [providers, selectedCity, selectedCategory, keyword, sortBy]);

  const activeStores = useMemo(() => {
    return stores.filter((s) => {
      if (selectedCity === 'Todas as Cidades') return true;
      return s.city === selectedCity || s.citiesTargeted.includes(selectedCity);
    });
  }, [stores, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header com resumo da busca */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Catálogo Regional de Profissionais
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {filteredProviders.length} prestador(es) qualificado(s) encontrado(s) em {selectedCity}
        </p>
      </div>

      {/* BANNER PATROCINADO NO TOPO */}
      {activeStores.length > 0 && (
        <div className="mb-8">
          <StoreBanner store={activeStores[0]} />
        </div>
      )}

      {/* Grid Principal: Filtros + Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR DE FILTROS */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Filtros de Busca
              </span>
              {(keyword || selectedCity !== 'Todas as Cidades' || selectedCategory !== 'todas') && (
                <button
                  onClick={() => {
                    setKeyword('');
                    setSelectedCity('Todas as Cidades');
                    setSelectedCategory('todas');
                  }}
                  className="text-[11px] text-amber-600 font-semibold hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Busca por texto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Palavra-chave
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: Reforma, Pintura, Laje"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Cidade Atendida
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="Todas as Cidades">Todas as Cidades</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} - SP
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Especialidade
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="todas">Todas as Categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="rating">Mais Bem Avaliados (★)</option>
                <option value="experience">Mais Experientes (Anos)</option>
                <option value="views">Mais Procurados</option>
              </select>
            </div>
          </div>
        </aside>

        {/* LISTAGEM DE RESULTADOS */}
        <section className="lg:col-span-3">
          {filteredProviders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <HardHat className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Nenhum profissional encontrado com esses filtros
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Tente selecionar outra cidade ou limpar a palavra-chave.
              </p>
              <button
                onClick={() => {
                  setKeyword('');
                  setSelectedCity('Todas as Cidades');
                  setSelectedCategory('todas');
                }}
                className="inline-block bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
              >
                Ver Todos os Profissionais
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
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Carregando catálogo regional...</div>}>
          <ExplorarContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
