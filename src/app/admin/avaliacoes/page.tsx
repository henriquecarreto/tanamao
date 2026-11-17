'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Star, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminAvaliacoesPage() {
  const { providers, deleteReview } = useApp();

  // Coletar todas as avaliações de todos os prestadores
  const allReviews = providers.flatMap((p) =>
    p.reviews.map((r) => ({
      ...r,
      providerName: p.fullName,
      providerId: p.id,
    }))
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
          Moderação de Avaliações ({allReviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Supervisione depoimentos deixados por clientes para garantir a idoneidade da plataforma
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4">Cliente / Autor</th>
                <th className="py-3.5 px-4">Profissional Avaliado</th>
                <th className="py-3.5 px-4">Nota</th>
                <th className="py-3.5 px-4">Comentário</th>
                <th className="py-3.5 px-4 text-right">Ação Moderadora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {rev.authorName}
                    {rev.serviceHired && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Serviço: {rev.serviceHired}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {rev.providerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 italic max-w-md">
                    "{rev.comment}"
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir esta avaliação?')) {
                          deleteReview(rev.id);
                        }
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-xl text-xs transition inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
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
