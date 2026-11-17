'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProviderCard } from '@/components/ProviderCard';
import { StoreBanner } from '@/components/StoreBanner';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useApp } from '@/context/AppContext';
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { categories, cities, providers, stores, selectedCity, setSelectedCity } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState(selectedCity);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (filterCity !== 'Todas as Cidades') params.set('cidade', filterCity);
    router.push(`/explorar?${params.toString()}`);
  };

  // Filtrar profissionais ativos para a vitrine (regra de negócio: trialing válido ou active)
  const activeProviders = providers.filter((p) => {
    const isCityMatch =
      selectedCity === 'Todas as Cidades' ||
      p.baseCity === selectedCity ||
      p.citiesServed.includes(selectedCity);

    const isSubscriptionValid =
      p.subscriptionStatus === 'trialing' || p.subscriptionStatus === 'active';

    return isCityMatch && isSubscriptionValid;
  });

  // Filtrar lojas da cidade selecionada
  const activeStores = stores.filter((s) => {
    if (selectedCity === 'Todas as Cidades') return true;
    return s.city === selectedCity || s.citiesTargeted.includes(selectedCity);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* HERO SECTION DE ALTO IMPACTO */}
        {/* ================================================================= */}
        <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-14 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Efeitos de Fundo */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
            {/* Tag em Destaque */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>O Portal Oficial da Construção Civil na Região</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              O profissional certo para sua obra,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                tá na mão.
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Encontre pedreiros, eletricistas, encanadores, gesseiros e ofertas de materiais em{' '}
              <strong className="text-white font-semibold">Palmital, Assis, Tarumã e Cândido Mota</strong>. Negocie direto pelo WhatsApp, sem taxas nem intermediários.
            </p>

            {/* BARRA DE BUSCA COMBINADA */}
            <div className="pt-4 max-w-3xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-200 text-slate-900 flex flex-col sm:flex-row gap-2.5 items-center"
              >
                {/* Campo de Busca */}
                <div className="flex-1 flex items-center gap-3 px-3 w-full">
                  <Search className="w-5 h-5 text-amber-500 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Qual profissional ou serviço você precisa?"
                    className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                  />
                </div>

                {/* Seletor de Cidade */}
                <div className="w-full sm:w-56 flex items-center gap-2 px-3 py-2 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-200">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full text-sm text-slate-700 bg-transparent font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="Todas as Cidades">Todas as Cidades</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name} - SP
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botão de Busca */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-bold px-7 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 shrink-0"
                >
                  <span>Buscar Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Tags rápidas */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <span className="font-medium text-slate-400">Mais procurados:</span>
                {['Pedreiro', 'Eletricista', 'Encanador', 'Pintor', 'Gesso & Drywall'].map((tag) => (
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
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Categorias da Construção Civil
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Encontre especialistas qualificados para cada etapa da sua obra
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
        {/* ESPAÇO PUBLICITÁRIO B2B - LOJAS DE MATERIAIS */}
        {/* ================================================================= */}
        {activeStores.length > 0 && (
          <section className="py-12 bg-slate-100 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Ofertas das Lojas Parceiras ({selectedCity})
                  </h2>
                </div>
                <Link
                  href="/loja/store-01"
                  className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800"
                >
                  Ver todas as lojas &rarr;
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
        {/* VITRINE DE PROFISSIONAIS EM DESTAQUE */}
        {/* ================================================================= */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Profissionais Verificados e Recomendados</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Profissionais em Destaque na Região
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Exibindo profissionais ativos com avaliação máxima em {selectedCity}
                </p>
              </div>

              <Link
                href="/explorar"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition self-start sm:self-auto shadow-sm"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProviders.slice(0, 6).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SEÇÃO "COMO FUNCIONA" - DUPLO IMPACTO (CLIENTES E PRESTADORES) */}
        {/* ================================================================= */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">
                Transparência e Rapidez
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Como Funciona o Tá Na Mão?
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Criamos a ponte mais curta e segura entre quem precisa de uma obra e os melhores profissionais da nossa terra.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Passo 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg mb-6">
                  1
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                  Escolha a Cidade e o Serviço
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Filtre por Palmital, Assis, Tarumã ou Cândido Mota e encontre a especialidade exata que você precisa.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 font-black text-2xl flex items-center justify-center shadow-lg mb-6">
                  2
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                  Analise Fotos e Avaliações
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Confira as fotos reais das obras já executadas, os anos de experiência e a nota deixada por vizinhos da região.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg mb-6">
                  3
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                  Chame Direto no WhatsApp
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Clique no botão verde e converse direto com o pedreiro, eletricista ou loja. Zero intermediários e zero comissões!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* BANNER CTA DE CAPTURA - 30 DIAS GRÁTIS */}
        {/* ================================================================= */}
        <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-16 px-4 sm:px-6 lg:px-8 text-slate-950">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3">
              <span className="bg-slate-950 text-amber-400 font-extrabold text-xs uppercase px-3 py-1 rounded-full">
                Oportunidade para Profissionais da Região
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                Você é prestador ou tem loja de materiais?
              </h2>
              <p className="text-slate-900 font-medium text-sm sm:text-base max-w-xl">
                Cadastre-se hoje mesmo e ganhe <strong>30 Dias Grátis</strong> para receber pedidos de orçamento no seu WhatsApp! Sem taxa por obra. Após o trial, apenas R$ 49,90/mês.
              </p>
            </div>

            <Link
              href="/anuncie"
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-base px-8 py-4 rounded-2xl shadow-2xl transition transform hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Quero 30 Dias Grátis</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
