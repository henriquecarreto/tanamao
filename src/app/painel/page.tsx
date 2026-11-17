'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  HardHat,
  MessageCircle,
  Eye,
  Star,
  Calendar,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  ShieldCheck,
  Copy,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PainelAssinantePage() {
  const {
    currentUser,
    providers,
    stores,
    updateProviderProfile,
    addPortfolioItem,
    deletePortfolioItem,
    addProviderDays,
    addStoreOffer,
    deleteStoreOffer,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'portfolio' | 'subscription'>('overview');
  const [copiedPix, setCopiedPix] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Prestador logado (ou padrão Marcos Eletricista)
  const isStore = currentUser?.role === 'store';
  const currentProvider = providers.find((p) => p.userId === currentUser?.id) || providers[1];
  const currentStore = stores.find((s) => s.userId === currentUser?.id) || stores[0];

  // Formulário de edição do perfil
  const [fullName, setFullName] = useState(currentProvider.fullName);
  const [phone, setPhone] = useState(currentProvider.phoneWhatsapp);
  const [bio, setBio] = useState(currentProvider.bio);
  const [experience, setExperience] = useState(currentProvider.yearsExperience);
  const [profileSaved, setProfileSaved] = useState(false);

  // Novo item de portfólio
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortImage, setNewPortImage] = useState(
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
  );

  // Nova oferta de loja
  const [newOfferName, setNewOfferName] = useState('');
  const [newOfferOrigPrice, setNewOfferOrigPrice] = useState('39.90');
  const [newOfferPromoPrice, setNewOfferPromoPrice] = useState('29.90');
  const [newOfferImage, setNewOfferImage] = useState(
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500&q=80'
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProviderProfile(currentProvider.id, {
      fullName,
      phoneWhatsapp: phone,
      bio,
      yearsExperience: Number(experience),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim()) return;
    addPortfolioItem(currentProvider.id, {
      title: newPortTitle.trim(),
      description: newPortDesc.trim() || undefined,
      imageUrl: newPortImage,
    });
    setNewPortTitle('');
    setNewPortDesc('');
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferName.trim()) return;
    addStoreOffer(currentStore.id, {
      productName: newOfferName.trim(),
      originalPrice: Number(newOfferOrigPrice) || undefined,
      promotionalPrice: Number(newOfferPromoPrice) || 29.9,
      imageUrl: newOfferImage,
      isActive: true,
      validUntil: '2026-12-31',
    });
    setNewOfferName('');
  };

  const handleSimulatePayment = () => {
    addProviderDays(currentProvider.id, 30);
    setPaymentSuccess(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
    setTimeout(() => setPaymentSuccess(false), 5000);
  };

  const pixKey =
    '00020126580014br.gov.bcb.pix0136d8923a41-2c0b-4876-9c48-tanamao520400005303986540549.905802BR5920TA NA MAO SERVICOS6008PALMITAL62070503***6304E8A1';

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* HEADER DO PAINEL */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl overflow-hidden shrink-0 border border-slate-700">
                {currentProvider.avatarUrl ? (
                  <Image
                    src={currentProvider.avatarUrl}
                    alt={currentProvider.fullName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{currentProvider.fullName.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isStore ? currentStore.companyName : currentProvider.fullName}
                  </h1>
                  {currentProvider.isVerified && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {isStore
                    ? `Painel Corporativo B2B • ${currentStore.city} - SP`
                    : `Painel do Profissional • ${currentProvider.baseCity} - SP`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/profissional/${currentProvider.id}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Ver Meu Perfil Público &rarr;
              </Link>
            </div>
          </div>

          {/* ALERTA DE STATUS DA ASSINATURA (TRAVA & TRIAL) */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              currentProvider.subscriptionStatus === 'trialing'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {currentProvider.subscriptionStatus === 'trialing' ? (
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}

              <div>
                <h4 className="font-bold text-sm">
                  {currentProvider.subscriptionStatus === 'trialing'
                    ? 'Você está no período de 30 Dias Grátis!'
                    : 'Assinatura Mensal Ativa!'}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {currentProvider.subscriptionStatus === 'trialing'
                    ? 'Restam 23 dias de teste gratuito. Seu perfil está ativo e visível nas buscas de toda a região.'
                    : `Seu plano está renovado e garantido até ${
                        currentProvider.currentPeriodEnd
                          ? new Date(currentProvider.currentPeriodEnd).toLocaleDateString('pt-BR')
                          : 'Próximo mês'
                      }.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('subscription')}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>Gerenciar Assinatura (R$ 49,90)</span>
            </button>
          </div>

          {/* TABS DE NAVEGAÇÃO DO PAINEL */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Visão Geral & Métricas
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Editar Meus Dados
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'portfolio'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isStore ? 'Gerenciar Ofertas da Loja' : 'Portfólio de Obras'}
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'subscription'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Minha Assinatura / Pagamento Pix
            </button>
          </div>

          {/* ============================================================= */}
          {/* ABA 1: VISÃO GERAL & MÉTRICAS (PROVA DE VALOR) */}
          {/* ============================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card WhatsApp Clicks */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Cliques no WhatsApp
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {currentProvider.totalWhatsappClicks}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    +14 contatos nesta semana
                  </span>
                </div>

                {/* Card Profile Views */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-blue-600">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Visualizações do Perfil
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {currentProvider.totalViews}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Visitantes de Palmital e região
                  </span>
                </div>

                {/* Card Avaliação */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-amber-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nota Média
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {currentProvider.ratingAvg.toFixed(1)} ★
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {currentProvider.reviewsCount} avaliações de clientes
                  </span>
                </div>

                {/* Card Status do Plano */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Plano Atual
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <HardHat className="w-5 h-5 text-slate-700" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {currentProvider.subscriptionStatus === 'trialing' ? '30 Dias Grátis' : 'Ativo'}
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold block">
                    R$ 49,90/mês
                  </span>
                </div>
              </div>

              {/* Dica de conversão */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Dica de Ouro para Aumentar seus Serviços:
                  </h4>
                  <p className="text-xs text-slate-300">
                    Profissionais com pelo menos <strong>3 fotos de obras</strong> no portfólio recebem <strong>4x mais chamadas no WhatsApp</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shrink-0"
                >
                  Adicionar Fotos Agora
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* ABA 2: EDITAR DADOS DO PERFIL */}
          {/* ============================================================= */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Atualizar Dados do Cadastro
              </h3>

              {profileSaved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dados atualizados com sucesso! Já estão visíveis no seu perfil público.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome Completo / Como quer ser chamado
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp para Receber Orçamentos
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Anos de Experiência na Profissão
                    </label>
                    <input
                      type="number"
                      required
                      value={experience}
                      onChange={(e) => setExperience(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Descrição dos seus Serviços (Biografia)
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Conte sobre sua pontualidade, ferramentas que utiliza, tipos de obras que realiza..."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================= */}
          {/* ABA 3: PORTFÓLIO / OFERTAS */}
          {/* ============================================================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              {!isStore ? (
                /* GESTÃO DE PORTFÓLIO DE PRESTADOR */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Adicionar Nova Foto de Obra
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mostre a qualidade do seu trabalho para novos clientes da região
                    </p>
                  </div>

                  <form onSubmit={handleAddPortfolio} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 max-w-xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Título da Obra *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPortTitle}
                        onChange={(e) => setNewPortTitle(e.target.value)}
                        placeholder="Ex: Reforma de Banheiro com Porcelanato"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Descrição Breve
                      </label>
                      <input
                        type="text"
                        value={newPortDesc}
                        onChange={(e) => setNewPortDesc(e.target.value)}
                        placeholder="Ex: Alvenaria, nicho embutido e impermeabilização"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        URL da Imagem da Obra
                      </label>
                      <input
                        type="url"
                        required
                        value={newPortImage}
                        onChange={(e) => setNewPortImage(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Adicionar ao Portfólio</span>
                    </button>
                  </form>

                  {/* Lista de Fotos Existentes */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">
                      Fotos Atualmente no seu Perfil ({currentProvider.portfolio.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {currentProvider.portfolio.map((item) => (
                        <div
                          key={item.id}
                          className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group"
                        >
                          <div className="relative h-44 w-full">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {item.title}
                            </span>
                            <button
                              onClick={() => deletePortfolioItem(currentProvider.id, item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Excluir foto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* GESTÃO DE OFERTAS DA LOJA */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Cadastrar Promoção da Semana na Loja
                    </h3>
                    <p className="text-xs text-slate-500">
                      Essas ofertas aparecem na Home e na sua vitrine oficial
                    </p>
                  </div>

                  <form onSubmit={handleAddOffer} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 max-w-xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        required
                        value={newOfferName}
                        onChange={(e) => setNewOfferName(e.target.value)}
                        placeholder="Ex: Cimento Votoran 50kg"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Preço De Tabela (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newOfferOrigPrice}
                          onChange={(e) => setNewOfferOrigPrice(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Preço Promocional (R$) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newOfferPromoPrice}
                          onChange={(e) => setNewOfferPromoPrice(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold text-amber-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Publicar Oferta</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* ABA 4: MINHA ASSINATURA / CHECKOUT PIX E CARTÃO */}
          {/* ============================================================= */}
          {activeTab === 'subscription' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Faturamento & Assinatura
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Renovação da Assinatura Mensal
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  {isStore
                    ? 'Plano Corporativo para Lojas de Materiais: R$ 249,90/mês'
                    : 'Plano Profissional Autônomo: R$ 49,90/mês (sem taxa sobre obras)'}
                </p>
              </div>

              {paymentSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-5 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-sm">Pagamento Confirmado com Sucesso!</h5>
                    <p className="text-xs text-emerald-700">
                      Sua assinatura foi renovada por mais 30 dias. Seu perfil continua no topo das buscas!
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Opção 1: PIX Copia e Cola & QR Code */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>Pagamento Instantâneo via Pix</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-3">
                    <div className="w-40 h-40 bg-slate-900 rounded-xl mx-auto flex items-center justify-center text-amber-400 font-mono text-xs p-2">
                      <QrCode className="w-32 h-32 text-white" />
                    </div>
                    <span className="text-xs text-slate-500 block">
                      Escaneie o QR Code no app do seu banco
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Código Pix Copia e Cola:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixKey}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-600 select-all"
                      />
                      <button
                        onClick={copyPix}
                        className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl shrink-0 transition"
                        title="Copiar código Pix"
                      >
                        <Copy className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                    {copiedPix && (
                      <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                        ✓ Código Pix copiado para a área de transferência!
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simular Confirmação de Pix (+30 Dias)</span>
                  </button>
                </div>

                {/* Opção 2: Cartão de Crédito */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span>Cartão de Crédito (Cobrança Recorrente)</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• 4242"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Pagar com Cartão (R$ {isStore ? '249,90' : '49,90'})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
