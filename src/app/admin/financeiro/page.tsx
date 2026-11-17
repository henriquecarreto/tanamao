'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DollarSign, CheckCircle2, Clock, Filter, QrCode, CreditCard, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminFinanceiroPage() {
  const { payments, confirmPayment } = useApp();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);

  const handleManualConfirm = (id: string, name: string) => {
    confirmPayment(id);
    try {
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    } catch {}
    alert(`Pagamento de ${name} confirmado manualmente! Assinatura renovada por 30 dias.`);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-emerald-600" />
          Controle Financeiro & Cobranças
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhamento de pagamentos via Pix e Cartão com liberação manual de assinaturas
        </p>
      </div>

      {/* CARDS DE RESUMO FINANCEIRO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
            Total Recebido (Aprovado)
          </span>
          <div className="text-3xl font-black text-emerald-600">
            R$ {totalPaid.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-slate-400 block">Cobranças liquidadas</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
            Pendente de Pagamento
          </span>
          <div className="text-3xl font-black text-amber-600">
            R$ {totalPending.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-slate-400 block">Aguardando compensação Pix</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
            Total de Transações
          </span>
          <div className="text-3xl font-black text-slate-900">
            {payments.length}
          </div>
          <span className="text-[11px] text-slate-400 block">Histórico completo</span>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-500">Filtrar status:</span>
          {(['all', 'paid', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition capitalize ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Todos' : st === 'paid' ? 'Pagos' : 'Pendentes'}
            </button>
          ))}
        </div>
      </div>

      {/* TABELA DE COBRANÇAS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Usuário / Assinante</th>
                <th className="py-3.5 px-4">Plano</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4">Método</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {pay.userName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {pay.planType === 'empresa_249_90'
                      ? 'Loja de Materiais (B2B)'
                      : 'Profissional Autônomo'}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    R$ {pay.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3.5 px-4 uppercase font-bold text-slate-600">
                    {pay.paymentMethod === 'pix' ? (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <QrCode className="w-3.5 h-3.5" /> Pix
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-700">
                        <CreditCard className="w-3.5 h-3.5" /> Cartão
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        pay.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pay.status === 'paid' ? 'Aprovado / Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {pay.status === 'pending' ? (
                      <button
                        onClick={() => handleManualConfirm(pay.id, pay.userName)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-sm"
                      >
                        Confirmar Recebimento Manual
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {pay.paidAt ? new Date(pay.paidAt).toLocaleDateString('pt-BR') : 'Confirmado'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
