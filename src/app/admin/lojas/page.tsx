'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Building2, Plus, ExternalLink, Calendar, MousePointerClick, ShieldCheck, Tag } from 'lucide-react';

export default function AdminLojasPage() {
  const { stores } = useApp();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-amber-500" />
            Lojas de Materiais & Anúncios B2B
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestão de anunciantes corporativos (R$ 249,90/mês), banners de destaque e cliques
          </p>
        </div>
      </div>

      {/* CARDS DE LOJAS CADASTRADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Banner da Loja */}
              <div className="relative h-44 w-full bg-slate-900">
                <Image
                  src={store.bannerUrl}
                  alt={store.companyName}
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                  Plano B2B Ativo
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-extrabold text-xl">{store.companyName}</h3>
                  <span className="text-xs text-slate-300">
                    {store.city} - SP • {store.address}
                  </span>
                </div>
              </div>

              {/* Informações de Gestão */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Mensalidade
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      R$ {store.planPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Cliques no Banner
                    </span>
                    <span className="font-black text-emerald-600 text-sm flex items-center gap-1">
                      <MousePointerClick className="w-4 h-4" />
                      {store.totalBannerClicks}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Cidades Alvo
                    </span>
                    <span className="font-bold text-slate-800 text-xs truncate block">
                      {store.citiesTargeted.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Ofertas cadastradas */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Ofertas Ativas na Vitrine ({store.offers.length}):
                  </span>
                  <div className="space-y-1.5">
                    {store.offers.map((off) => (
                      <div
                        key={off.id}
                        className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-100"
                      >
                        <span className="font-medium text-slate-800 truncate mr-2">
                          {off.productName}
                        </span>
                        <span className="font-bold text-amber-600 shrink-0">
                          R$ {off.promotionalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href={`/loja/${store.id}`}
                className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1"
              >
                <span>Ver Vitrine Pública</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              </Link>

              <button
                onClick={() => alert(`Renovação manual confirmada para ${store.companyName}!`)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs transition"
              >
                +30 Dias Plano Loja
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
