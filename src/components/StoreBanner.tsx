'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoreProfile } from '@/types';
import { useApp } from '@/context/AppContext';
import { Building2, Tag, ArrowRight, MessageCircle, MapPin } from 'lucide-react';

interface StoreBannerProps {
  store: StoreProfile;
}

export const StoreBanner: React.FC<StoreBannerProps> = ({ store }) => {
  const { registerClick } = useApp();

  const handleBannerClick = () => {
    registerClick(store.id, 'banner_click');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    registerClick(store.id, 'banner_click');
    const msg = encodeURIComponent(
      `Olá! Vi o anúncio da ${store.companyName} no portal Tá Na Mão e gostaria de cotar materiais!`
    );
    window.open(`https://wa.me/55${store.phoneWhatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl group">
      {/* Imagem de Fundo com Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-50 transition duration-500 scale-100 group-hover:scale-105">
        <Image
          src={store.bannerUrl}
          alt={store.companyName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full">
        {/* Header do Banner */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>Loja Parceira Destaque</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{store.city} - SP</span>
          </div>
        </div>

        {/* Informações da Loja e Ofertas */}
        <div className="my-6 space-y-2">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-amber-400 transition">
            {store.companyName}
          </h3>
          <p className="text-sm text-slate-300 flex items-center gap-2">
            <span>{store.address}</span>
          </p>

          {/* Destaque de Oferta Ativa */}
          {store.offers && store.offers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block">Destaque da Semana:</span>
                <span className="font-bold text-white text-sm">
                  {store.offers[0].productName} por apenas{' '}
                  <span className="text-amber-400 font-extrabold">
                    R$ {store.offers[0].promotionalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/loja/${store.id}`}
            onClick={handleBannerClick}
            className="flex-1 min-w-[160px] text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <span>Ver Catálogo de Ofertas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Chamar Balcão de Vendas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
