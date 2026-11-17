'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProviderProfile } from '@/types';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  CalendarPlus,
  Ban,
  Trash2,
  Edit,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminProfissionaisPage() {
  const {
    providers,
    addProviderDays,
    toggleProviderVerified,
    toggleProviderBlocked,
    deleteProvider,
    updateProviderProfile,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingProvider, setEditingProvider] = useState<ProviderProfile | null>(null);

  // Estados para edição no modal
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');

  const filteredProviders = providers.filter((p) => {
    if (statusFilter !== 'all' && p.subscriptionStatus !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const inName = p.fullName.toLowerCase().includes(term);
      const inCity = p.baseCity.toLowerCase().includes(term);
      return inName || inCity;
    }
    return true;
  });

  const handleAdd30Days = (providerId: string, name: string) => {
    addProviderDays(providerId, 30);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}
    alert(`+30 Dias ativados com sucesso para ${name}!`);
  };

  const handleOpenEdit = (p: ProviderProfile) => {
    setEditingProvider(p);
    setEditName(p.fullName);
    setEditPhone(p.phoneWhatsapp);
    setEditBio(p.bio);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;
    updateProviderProfile(editingProvider.id, {
      fullName: editName,
      phoneWhatsapp: editPhone,
      bio: editBio,
    });
    setEditingProvider(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-amber-500" />
            Gestão de Profissionais Autônomos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle de assinaturas, ativação manual de 30 dias, verificação e bloqueios
          </p>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou cidade..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold shrink-0">Filtrar status:</span>
          {['all', 'active', 'trialing', 'past_due', 'canceled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? 'Todos'
                : st === 'active'
                ? 'Ativos'
                : st === 'trialing'
                ? 'Trial 30d'
                : st === 'past_due'
                ? 'Vencidos'
                : 'Bloqueados'}
            </button>
          ))}
        </div>
      </div>

      {/* TABELA DE PROFISSIONAIS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Profissional</th>
                <th className="py-3.5 px-4">Cidade / Categoria</th>
                <th className="py-3.5 px-4">Status / Vencimento</th>
                <th className="py-3.5 px-4">Métricas</th>
                <th className="py-3.5 px-4 text-right">Ações Rápidas do Dono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProviders.map((prov) => (
                <tr key={prov.id} className="hover:bg-slate-50/80 transition">
                  {/* Nome e Selo */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 overflow-hidden shrink-0 border">
                        {prov.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">
                            {prov.fullName}
                          </span>
                          {prov.isVerified ? (
                            <span
                              title="Profissional Verificado"
                              className="text-amber-500 font-bold"
                            >
                              <ShieldCheck className="w-4 h-4 fill-amber-400 text-slate-900" />
                            </span>
                          ) : (
                            <span
                              title="Sem selo"
                              className="text-slate-300"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          WhatsApp: {prov.phoneWhatsapp}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Cidade e Categoria */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">
                      {prov.baseCity} - SP
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {prov.categories[0]?.name || 'Geral'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        prov.subscriptionStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prov.subscriptionStatus === 'trialing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prov.subscriptionStatus === 'active'
                        ? 'Assinatura Ativa'
                        : prov.subscriptionStatus === 'trialing'
                        ? 'Em Teste Grátis'
                        : 'Vencido / Bloqueado'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {prov.currentPeriodEnd
                        ? `Até ${new Date(prov.currentPeriodEnd).toLocaleDateString('pt-BR')}`
                        : 'Trial 30 dias'}
                    </span>
                  </td>

                  {/* Métricas */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="text-emerald-700 font-bold block">
                        💬 {prov.totalWhatsappClicks} cliques WhatsApp
                      </span>
                      <span className="text-slate-500 block">
                        👁 {prov.totalViews} visualizações
                      </span>
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {/* Ativar +30 Dias */}
                      <button
                        onClick={() => handleAdd30Days(prov.id, prov.fullName)}
                        title="Ativar +30 Dias Manualmente (Aprovar Pix direto)"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>+30 Dias</span>
                      </button>

                      {/* Toggle Selo Verificado */}
                      <button
                        onClick={() => toggleProviderVerified(prov.id)}
                        title="Alternar Selo de Verificado"
                        className={`p-1.5 rounded-xl border transition ${
                          prov.isVerified
                            ? 'bg-amber-500 text-slate-950 border-amber-600'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>

                      {/* Editar Dados */}
                      <button
                        onClick={() => handleOpenEdit(prov)}
                        title="Editar Informações"
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Bloquear / Pausar */}
                      <button
                        onClick={() => toggleProviderBlocked(prov.id)}
                        title={prov.subscriptionStatus === 'canceled' ? 'Desbloquear' : 'Bloquear perfil'}
                        className={`p-1.5 rounded-xl border transition ${
                          prov.subscriptionStatus === 'canceled'
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border-slate-200'
                        }`}
                      >
                        <Ban className="w-4 h-4" />
                      </button>

                      {/* Excluir */}
                      <button
                        onClick={() => {
                          if (confirm(`Excluir permanentemente ${prov.fullName}?`)) {
                            deleteProvider(prov.id);
                          }
                        }}
                        title="Excluir Definitivamente"
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO DO PROFISSIONAL */}
      {editingProvider && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Editar Cadastro: {editingProvider.fullName}
              </h3>
              <button
                onClick={() => setEditingProvider(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Biografia / Descrição
                </label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
