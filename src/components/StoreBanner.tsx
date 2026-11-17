'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoreProfile } from '@/types';
import { useApp } from '@/context/AppContext';
import { Building2, ArrowRight, MessageCircle, MapPin, ShieldCheck } from 'lucide-react';

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
      `Olá! Vi o anúncio da ${store.companyName} no portal Tá Na Mão e gostaria de solicitar um atendimento!`
    );
    window.open(`https://wa.me/55${store.phoneWhatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl group">
      {/* Imagem de Fundo com Overlay */}
      <div className="absolute inset-0 z-0 opacity-35 group-hover:opacity-45 transition duration-500 scale-100 group-hover:scale-105">
        <Image
          src={store.bannerUrl}
          alt={store.companyName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full space-y-4">
        {/* Header do Banner */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>Loja Parceira Oficial Tá Na Mão</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{store.city} - {store.state}</span>
          </div>
        </div>

        {/* Informações da Loja */}
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight group-hover:text-amber-400 transition">
            {store.companyName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {store.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Atende um raio de até {store.coverageRadiusKm} km a partir de {store.city}</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/loja/${store.id}`}
            onClick={handleBannerClick}
            className="flex-1 min-w-[150px] text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <span>Conhecer Loja & Rota</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Chamar Atendimento WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
