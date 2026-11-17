'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProviderCard } from '@/components/ProviderCard';
import { StoreBanner } from '@/components/StoreBanner';
import { CategoryIcon } from '@/components/CategoryIcon';
import { LocationModal } from '@/components/LocationModal';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MapPin,
  Sparkles,
  Navigation,
  ArrowRight,
  Crosshair,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { categories, providers, stores, clientLocation, getProviderDistanceAndTier, detectGpsLocation } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    router.push(`/explorar?${params.toString()}`);
  };

  const handleQuickGps = async () => {
    setDetectingGps(true);
    await detectGpsLocation();
    setDetectingGps(false);
  };

  // Classificação em cascata dos prestadores ativos
  const cascadingProviders = useMemo(() => {
    return providers
      .filter((p) => p.subscriptionStatus === 'trialing' || p.subscriptionStatus === 'active')
      .map((p) => ({
        ...p,
        proximity: getProviderDistanceAndTier(p),
      }))
      .filter((p) => p.proximity.tier <= 3) // Exclui fora do raio
      .sort((a, b) => {
        if (a.proximity.tier !== b.proximity.tier) {
          return a.proximity.tier - b.proximity.tier;
        }
        if (a.proximity.distanceKm !== b.proximity.distanceKm) {
          return a.proximity.distanceKm - b.proximity.distanceKm;
        }
        if (a.isVerified !== b.isVerified) {
          return a.isVerified ? -1 : 1;
        }
        return b.ratingAvg - a.ratingAvg;
      });
  }, [providers, clientLocation]);

  // Lojas cuja cobertura em KM alcança a localização do cliente
  const activeStores = useMemo(() => {
    return stores.filter((s) => s.subscriptionStatus === 'active');
  }, [stores]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* HERO SECTION COM BUSCA GEOLOCALIZADA NACIONAL */}
        {/* ================================================================= */}
        <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
            {/* Tag em Destaque */}
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Busca Geolocalizada em Tempo Real — Em Todo o Brasil</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              O profissional mais próximo da sua obra,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                tá na mão.
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Encontre pedreiros, eletricistas, encanadores e engenheiros ordenados por distância exata da sua rua ou bairro. Converse direto no WhatsApp, sem comissões.
            </p>

            {/* BARRA DE BUSCA COMBINADA GEOLOCALIZADA */}
            <div className="pt-4 max-w-3xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-200 text-slate-900 flex flex-col sm:flex-row gap-2.5 items-center"
              >
                {/* Campo de Busca por Serviço */}
                <div className="flex-1 flex items-center gap-3 px-3 w-full">
                  <Search className="w-5 h-5 text-amber-500 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Qual profissional você precisa? (ex: Pedreiro, Eletricista)"
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                  />
                </div>

                {/* Botão de Localização no Form */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-2 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-200">
                  <button
                    type="button"
                    onClick={() => setLocationModalOpen(true)}
                    className="flex items-center gap-1.5 text-left text-xs text-slate-700 hover:text-amber-600 transition truncate max-w-[190px]"
                  >
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-bold truncate">
                      {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
                      {clientLocation.city} - {clientLocation.state}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickGps}
                    title="Usar GPS"
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Botão de Busca */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 shrink-0"
                >
                  <span>Buscar Próximos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Tags rápidas */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <span className="font-semibold text-slate-400">Em alta:</span>
                {['Pedreiro', 'Eletricista', 'Encanador', 'Pintor', 'Gesseiro'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchTerm(tag);
                      router.push(`/explorar?q=${encodeURIComponent(tag)}`);
                    }}
                    className="bg-slate-800/90 hover:bg-slate-700 hover:text-white px-3 py-1 rounded-full border border-slate-700 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* GRADE DE CATEGORIAS DA CONSTRUÇÃO CIVIL */}
        {/* ================================================================= */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Categorias da Construção Civil
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Selecione uma especialidade para ver profissionais no seu raio de proximidade
                </p>
              </div>
              <Link
                href="/explorar"
                className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/explorar?cat=${cat.slug}`}
                  className="group bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-amber-400 group-hover:bg-amber-500 flex items-center justify-center text-slate-700 group-hover:text-slate-950 transition duration-200 shadow-sm mb-3">
                    <CategoryIcon name={cat.iconName} className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-900 line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ESPAÇO PUBLICITÁRIO INSTITUCIONAL B2B - LOJAS DE MATERIAIS */}
        {/* ================================================================= */}
        {activeStores.length > 0 && (
          <section className="py-12 bg-slate-100 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Lojas e Depósitos Parceiros na Região
                  </h2>
                </div>
                <Link
                  href="/loja/store-01"
                  className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                  Ver lojas &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeStores.map((store) => (
                  <StoreBanner key={store.id} store={store} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* VITRINE INTELIGENTE EM CASCATA OBRIGATÓRIA (RUA -> CIDADE -> REGIÃO) */}
        {/* ================================================================= */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-2">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Ordenação Inteligente por Proximidade GPS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Profissionais Próximos de Você
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Exibindo profissionais a partir de{' '}
                  <strong className="text-slate-800">
                    {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
                    {clientLocation.city} - {clientLocation.state}
                  </strong>
                </p>
              </div>

              <button
                onClick={() => setLocationModalOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs transition self-start sm:self-auto shadow-sm"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Trocar Minha Localização</span>
              </button>
            </div>

            {/* Grid de Cards Ordenados em Cascata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cascadingProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SEÇÃO "COMO FUNCIONA" */}
        {/* ================================================================= */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">
                Transparência e Rapidez
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Como Funciona a Busca em Cascata?
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                O Tá Na Mão prioriza quem está a poucos metros da sua porta para que o atendimento seja rápido e econômico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg mx-auto mb-5">
                  1º
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-2">
                  1º Nível: Sua Rua e Bairro (até 2 km)
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Aparecem no topo absoluto os profissionais que moram ou estão trabalhando no mesmo bairro que você.
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg mx-auto mb-5">
                  2º
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-2">
                  2º Nível: Na Sua Cidade (2 km a 15 km)
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Em seguida, aparecem os prestadores do seu município, ordenados do mais próximo ao mais distante.
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg mx-auto mb-5">
                  3º
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-2">
                  3º Nível: Cidades Vizinhas & Região
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Profissionais de cidades próximas cujo raio de atendimento alcança a sua localização.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BANNER CTA DE CAPTURA - 30 DIAS GRÁTIS */}
        <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-16 px-4 sm:px-6 lg:px-8 text-slate-950">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3">
              <span className="bg-slate-950 text-amber-400 font-black text-xs uppercase px-3 py-1 rounded-full">
                Para Prestadores e Lojas de Todo o Brasil
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                Quer receber chamadas de obras no seu WhatsApp?
              </h2>
              <p className="text-slate-900 font-medium text-xs sm:text-sm max-w-xl">
                Comece com <strong>30 Dias Grátis</strong> automáticos. Sem taxas sobre suas obras. Após o primeiro mês, apenas R$ 49,90/mês.
              </p>
            </div>

            <Link
              href="/anuncie"
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-2xl transition transform hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Ativar 30 Dias Grátis</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </div>
  );
}
