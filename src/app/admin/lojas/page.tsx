'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Building2, ExternalLink, Calendar, MousePointerClick, MessageCircle, MapPin, Compass } from 'lucide-react';

export default function AdminLojasPage() {
  const { stores } = useApp();

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="w-7 h-7 text-amber-500" />
          Lojas Anunciantes Institucionais (B2B)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Gestão de anunciantes corporativos (R$ 199,90 e R$ 299,90/mês), banners de destaque e raio de cobertura
        </p>
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
                <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                  {store.planTier === 'featured_299_90' ? 'Plano Destaque 100km' : 'Plano Regional'}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-extrabold text-xl">{store.companyName}</h3>
                  <span className="text-xs text-slate-300">
                    {store.neighborhood ? `${store.neighborhood}, ` : ''}{store.city} - {store.state}
                  </span>
                </div>
              </div>

              {/* Informações de Gestão */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2">
                  {store.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Mensalidade
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      R$ {store.planPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Cliques no Banner
                    </span>
                    <span className="font-black text-emerald-600 text-sm flex items-center gap-1">
                      <MousePointerClick className="w-4 h-4" />
                      {store.totalBannerClicks}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Raio de Entrega
                    </span>
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-amber-500" />
                      até {store.coverageRadiusKm} km
                    </span>
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
                <span>Ver Página Institucional</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              </Link>

              <button
                onClick={() => alert(`Plano da ${store.companyName} verificado e ativo no gateway!`)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs transition"
              >
                Verificar Status Gateway
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
