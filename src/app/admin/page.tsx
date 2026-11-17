'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  DollarSign,
  Users,
  HardHat,
  Building2,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { providers, stores, payments } = useApp();

  // Métricas Calculadas
  const activePaidProviders = providers.filter((p) => p.subscriptionStatus === 'active');
  const trialingProviders = providers.filter((p) => p.subscriptionStatus === 'trialing');
  const pastDueProviders = providers.filter(
    (p) => p.subscriptionStatus === 'past_due' || p.subscriptionStatus === 'canceled'
  );
  const activeStores = stores.filter((s) => s.subscriptionStatus === 'active');

  const mrrProviders = activePaidProviders.reduce((acc, p) => acc + p.planPrice, 0);
  const mrrStores = activeStores.reduce((acc, s) => acc + s.planPrice, 0);
  const totalMrr = mrrProviders + mrrStores;

  const totalWhatsappClicks = providers.reduce((acc, p) => acc + p.totalWhatsappClicks, 0);
  const totalViews = providers.reduce((acc, p) => acc + p.totalViews, 0);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header com Título e Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Executivo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visão consolidada da operação regional (Palmital, Assis, Tarumã e Cândido Mota)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/profissionais"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Gerenciar Profissionais</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* GRADE DE KPIS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: MRR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            MRR (Receita Recorrente)
          </span>
          <div className="text-2xl font-black text-emerald-600">
            R$ {totalMrr.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[10px] text-slate-500 block">
            R$ 49,90 autônomos + R$ 249,90 lojas
          </span>
        </div>

        {/* KPI 2: Prestadores Ativos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Prestadores Pagantes
          </span>
          <div className="text-2xl font-black text-slate-900">
            {activePaidProviders.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Mensalidade em dia
          </span>
        </div>

        {/* KPI 3: Trial 30 Dias */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Em 30 Dias Grátis
          </span>
          <div className="text-2xl font-black text-amber-600">
            {trialingProviders.length}
          </div>
          <span className="text-[10px] text-amber-700 font-semibold block">
            Potenciais assinantes
          </span>
        </div>

        {/* KPI 4: Inadimplentes / Vencidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Perfis Invisíveis / Vencidos
          </span>
          <div className="text-2xl font-black text-red-600">
            {pastDueProviders.length}
          </div>
          <span className="text-[10px] text-slate-400 block">
            Trava de busca ativa
          </span>
        </div>

        {/* KPI 5: Lojas B2B */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Lojas Anunciantes
          </span>
          <div className="text-2xl font-black text-blue-600">
            {activeStores.length}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Banners de destaque
          </span>
        </div>

        {/* KPI 6: Cliques no WhatsApp */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Cliques WhatsApp Gerados
          </span>
          <div className="text-2xl font-black text-emerald-600">
            {totalWhatsappClicks}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            Obras iniciadas
          </span>
        </div>
      </div>

      {/* SEÇÃO DUPLA: ÚLTIMOS CADASTROS & ÚLTIMOS PAGAMENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabela de Últimos Prestadores Cadastrados */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-500" />
              Últimos Prestadores na Região
            </h3>
            <Link
              href="/admin/profissionais"
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              Ver todos &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {providers.slice(0, 5).map((prov) => (
              <div key={prov.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{prov.fullName}</span>
                    {prov.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {prov.categories[0]?.name} • {prov.baseCity} - SP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      prov.subscriptionStatus === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prov.subscriptionStatus === 'trialing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {prov.subscriptionStatus === 'active'
                      ? 'Ativo'
                      : prov.subscriptionStatus === 'trialing'
                      ? 'Trial 30d'
                      : 'Pendente'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {prov.totalWhatsappClicks} 💬
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Pagamentos Recentes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Últimas Cobranças & Assinaturas
            </h3>
            <Link
              href="/admin/financeiro"
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              Ver financeiro &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {payments.slice(0, 5).map((pay) => (
              <div key={pay.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                    {pay.userName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Método: {pay.paymentMethod.toUpperCase()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 block">
                    R$ {pay.amount.toFixed(2).replace('.', ',')}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      pay.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {pay.status === 'paid' ? 'Pago' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
