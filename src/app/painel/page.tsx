'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { fetchCepBrasilApi } from '@/lib/geolocation';
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
  MapPin,
  Crosshair,
  Compass,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PainelPage() {
  const {
    currentUser,
    providers,
    stores,
    updateProviderProfile,
    updateStoreProfile,
    addPortfolioItem,
    deletePortfolioItem,
    processAutomatedPayment,
    detectGpsLocation,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'profile' | 'portfolio' | 'subscription'>('overview');
  const [copiedPix, setCopiedPix] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  // Perfil ativo
  const isStore = currentUser?.role === 'store';
  const currentProvider = providers.find((p) => p.userId === currentUser?.id) || providers[1];
  const currentStore = stores.find((s) => s.userId === currentUser?.id) || stores[0];

  // Edição de Perfil
  const [fullName, setFullName] = useState(currentProvider.fullName);
  const [phone, setPhone] = useState(currentProvider.phoneWhatsapp);
  const [bio, setBio] = useState(currentProvider.bio);
  const [experience, setExperience] = useState(currentProvider.yearsExperience);
  const [profileSaved, setProfileSaved] = useState(false);

  // Edição de Localização e Raio (BrasilAPI v2)
  const [cep, setCep] = useState(currentProvider.cep || '19970-000');
  const [street, setStreet] = useState(currentProvider.street || '');
  const [neighborhood, setNeighborhood] = useState(currentProvider.neighborhood || 'Centro');
  const [city, setCity] = useState(currentProvider.city || 'Palmital');
  const [state, setState] = useState(currentProvider.state || 'SP');
  const [latitude, setLatitude] = useState(currentProvider.latitude || -22.7936);
  const [longitude, setLongitude] = useState(currentProvider.longitude || -50.2153);
  const [radiusKm, setRadiusKm] = useState(currentProvider.serviceRadiusKm || 35);
  const [loadingCep, setLoadingCep] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);

  // Novo item de portfólio
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortImage, setNewPortImage] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80'
  );

  // Busca automática do CEP na BrasilAPI v2
  const handleCepSearch = async (val: string) => {
    setCep(val);
    const clean = val.replace(/\D/g, '');
    if (clean.length === 8) {
      setLoadingCep(true);
      const res = await fetchCepBrasilApi(clean);
      setLoadingCep(false);
      if (res) {
        setStreet(res.street || '');
        setNeighborhood(res.neighborhood || '');
        setCity(res.city || '');
        setState(res.state || 'SP');
        setLatitude(res.latitude);
        setLongitude(res.longitude);
      }
    }
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStore) {
      updateStoreProfile(currentStore.id, {
        cep,
        street,
        neighborhood,
        city,
        state,
        latitude,
        longitude,
        coverageRadiusKm: radiusKm,
      });
    } else {
      updateProviderProfile(currentProvider.id, {
        cep,
        street,
        neighborhood,
        city,
        state,
        latitude,
        longitude,
        serviceRadiusKm: radiusKm,
      });
    }
    setLocationSaved(true);
    setTimeout(() => setLocationSaved(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStore) {
      updateStoreProfile(currentStore.id, {
        companyName: fullName,
        phoneWhatsapp: phone,
        description: bio,
      });
    } else {
      updateProviderProfile(currentProvider.id, {
        fullName,
        phoneWhatsapp: phone,
        bio,
        yearsExperience: Number(experience),
      });
    }
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

  // Simulação de Pagamento Automatizado (Post na rota de Webhook)
  const handleTriggerWebhookPayment = async () => {
    setSimulatingWebhook(true);

    try {
      // 1. Chama a rota de checkout para gerar a transação
      const checkRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: isStore ? 'store_basic_199_90' : 'provider_49_90',
          paymentMethod: 'pix',
          userId: isStore ? currentStore.userId : currentProvider.userId,
        }),
      });
      const checkData = await checkRes.json();

      // 2. Dispara a notificação de Webhook do gateway (liberação 100% automatizada)
      const hookRes = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: checkData.transactionId,
          status: 'paid',
          userId: isStore ? currentStore.userId : currentProvider.userId,
          planType: isStore ? 'store_basic_199_90' : 'provider_49_90',
        }),
      });
      const hookData = await hookRes.json();

      // 3. Atualiza o estado em memória local instantaneamente (Zero Intervenção Manual)
      await processAutomatedPayment({
        userId: isStore ? currentStore.userId : currentProvider.userId,
        userName: isStore ? currentStore.companyName : currentProvider.fullName,
        planType: isStore ? 'store_basic_199_90' : 'provider_49_90',
        amount: isStore ? 199.90 : 49.90,
        paymentMethod: 'pix',
      });

      setPaymentSuccess(true);
      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingWebhook(false);
    }
  };

  const pixKey =
    '00020126580014br.gov.bcb.pix0136d8923a41-2c0b-4876-9c48-tanamaonacional52040000530398654049.905802BR5920TA NA MAO SERVICOS6008BRASIL62070503***6304E8A1';

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
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xl overflow-hidden shrink-0 border border-slate-700">
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
                    ? `Painel da Loja Anunciante • ${currentStore.city} - ${currentStore.state}`
                    : `Painel do Prestador • ${currentProvider.neighborhood}, ${currentProvider.city} - ${currentProvider.state}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={isStore ? `/loja/${currentStore.id}` : `/profissional/${currentProvider.id}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Ver Meu Perfil Público &rarr;
              </Link>
            </div>
          </div>

          {/* ALERTA DE STATUS DA ASSINATURA EM TEMPO REAL */}
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
                <h4 className="font-black text-sm">
                  {currentProvider.subscriptionStatus === 'trialing'
                    ? 'Status da Conta: 30 Dias Grátis Ativos'
                    : 'Status da Conta: Assinatura Mensal Ativa'}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {currentProvider.subscriptionStatus === 'trialing'
                    ? 'Seu perfil está visível no topo das buscas geolocalizadas na sua cidade e região.'
                    : `Sua assinatura está renovada automaticamente até ${
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
              <span>Checkout Automatizado Pix / Cartão</span>
            </button>
          </div>

          {/* TABS DE NAVEGAÇÃO */}
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
              onClick={() => setActiveTab('location')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'location'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Localização & Raio em KM</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Editar Cadastro
            </button>
            {!isStore && (
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === 'portfolio'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Portfólio de Obras
              </button>
            )}
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === 'subscription'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Assinatura & Webhook
            </button>
          </div>

          {/* ============================================================= */}
          {/* TAB 1: VISÃO GERAL */}
          {/* ============================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    Contatos diretos de clientes
                  </span>
                </div>

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
                    Visitantes na sua região
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-amber-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Avaliação Média
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    {currentProvider.ratingAvg.toFixed(1)} ★
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {currentProvider.reviewsCount} depoimentos recebidos
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Raio de Atendimento
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-slate-700" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {currentProvider.serviceRadiusKm} km
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold block">
                    A partir de {currentProvider.city}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 2: CONFIGURAÇÃO DE LOCALIZAÇÃO & RAIO EM KM (BRASILAPI V2) */}
          {/* ============================================================= */}
          {activeTab === 'location' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  Configurar Endereço, GPS e Raio de Atendimento
                </h3>
                <p className="text-xs text-slate-500">
                  O sistema usa seu CEP para obter coordenadas exatas via BrasilAPI v2 e calcular a distância até os clientes
                </p>
              </div>

              {locationSaved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Localização e raio de atendimento atualizados com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveLocation} className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    CEP da sua Base / Oficina / Residência *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cep}
                      onChange={(e) => handleCepSearch(e.target.value)}
                      placeholder="Ex: 19970-000"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500 font-mono"
                    />
                    {loadingCep && (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ⚡ Digite os 8 números: autopreenche Rua, Bairro, Cidade, Estado e Latitude/Longitude.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Logradouro / Rua
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Estado (UF) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold uppercase"
                    />
                  </div>
                </div>

                {/* Coordenadas */}
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Latitude GPS
                    </span>
                    <span className="font-mono text-slate-800 font-bold">{latitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Longitude GPS
                    </span>
                    <span className="font-mono text-slate-800 font-bold">{longitude.toFixed(4)}</span>
                  </div>
                </div>

                {/* SLIDER DE RAIO EM KM */}
                <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-amber-950 uppercase">
                      Raio Máximo de Atendimento para Obras
                    </label>
                    <span className="text-sm font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                      {radiusKm} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-600">
                    Você aparecerá para clientes localizados a até <strong>{radiusKm} km</strong> do seu endereço (incluindo municípios vizinhos).
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-black px-6 py-3 rounded-xl text-xs transition flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Salvar Localização & Raio</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 3: EDITAR CADASTRO */}
          {/* ============================================================= */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4">
                Atualizar Dados do Cadastro
              </h3>

              {profileSaved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dados atualizados com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome Completo / Fantasia
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

                  {!isStore && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Anos de Experiência
                      </label>
                      <input
                        type="number"
                        required
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {isStore ? 'Descrição da Loja' : 'Descrição dos seus Serviços'}
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados</span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 4: PORTFÓLIO DE OBRAS (PRESTADOR) */}
          {/* ============================================================= */}
          {activeTab === 'portfolio' && !isStore && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Adicionar Foto de Obra Realizada
                </h3>
                <p className="text-xs text-slate-500">
                  Profissionais com portfólio fotográfico recebem até 4x mais contatos no WhatsApp
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
                    placeholder="Ex: Reforma de Cozinha e Bancada em Alvenaria"
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
                    placeholder="Ex: Assentamento de porcelanato 84x84 e nicho"
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

              {/* Lista */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 5: CHECKOUT AUTOMATIZADO 100% COM WEBHOOK */}
          {/* ============================================================= */}
          {activeTab === 'subscription' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Checkout 100% Automatizado via Gateway
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Renovação da Assinatura Mensal (R$ {isStore ? '199,90' : '49,90'})
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Zero conferência manual: assim que o Pix ou Cartão for pago, a notificação via Webhook libera seu painel na mesma hora!
                </p>
              </div>

              {paymentSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-5 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-black text-sm">Webhook Processado com Sucesso!</h5>
                    <p className="text-xs text-emerald-700">
                      Assinatura liberada instantaneamente na tela sem precisar de intervenção manual do administrador.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PIX DINÂMICO */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>Pix Dinâmico Instantâneo (QR Code)</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-3">
                    <div className="w-40 h-40 bg-slate-900 rounded-xl mx-auto flex items-center justify-center text-amber-400 font-mono text-xs p-2">
                      <QrCode className="w-32 h-32 text-white" />
                    </div>
                    <span className="text-xs text-slate-500 block">
                      Escaneie no aplicativo do seu banco
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
                      >
                        <Copy className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                    {copiedPix && (
                      <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                        ✓ Copiado para a área de transferência!
                      </span>
                    )}
                  </div>

                  {/* BOTÃO DE SIMULAÇÃO DE WEBHOOK AUTOMÁTICO */}
                  <div className="pt-2">
                    <button
                      onClick={handleTriggerWebhookPayment}
                      disabled={simulatingWebhook}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {simulatingWebhook ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Disparando Webhook /api/webhooks/payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simular Confirmação Automática de Pix (Webhook)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 block text-center mt-1">
                      Dispara POST na rota do Webhook e libera a tela instantaneamente
                    </span>
                  </div>
                </div>

                {/* CARTÃO DE CRÉDITO */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span>Cartão de Crédito (Recorrência Automática)</span>
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
                    onClick={handleTriggerWebhookPayment}
                    disabled={simulatingWebhook}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-black py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Pagar com Cartão (R$ {isStore ? '199,90' : '49,90'})</span>
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
