'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProviderProfile } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface ProviderCardProps {
  provider: ProviderProfile;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const { registerClick } = useApp();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    registerClick(provider.id, 'whatsapp_click');
    const msg = encodeURIComponent(
      `Olá ${provider.fullName}, vi seu perfil no portal Tá Na Mão e gostaria de solicitar um orçamento para um serviço!`
    );
    window.open(`https://wa.me/55${provider.phoneWhatsapp}?text=${msg}`, '_blank');
  };

  const handleProfileClick = () => {
    registerClick(provider.id, 'profile_view');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Banner / Card Header */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar com Badge de Verificado */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-inner group-hover:border-amber-400 transition">
              {provider.avatarUrl ? (
                <Image
                  src={provider.avatarUrl}
                  alt={provider.fullName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xl">
                  {provider.fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            {provider.isVerified && (
              <div
                title="Profissional Verificado pelo Tá Na Mão"
                className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md border-2 border-white"
              >
                <ShieldCheck className="w-4 h-4 fill-slate-950 text-amber-500" />
              </div>
            )}
          </div>

          {/* Nome, Categoria e Avaliação */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {provider.categories[0] && (
                <span className="inline-block bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-200">
                  {provider.categories[0].name}
                </span>
              )}
            </div>

            <Link
              href={`/profissional/${provider.id}`}
              onClick={handleProfileClick}
              className="block font-bold text-slate-900 text-lg hover:text-amber-600 transition truncate mt-1"
            >
              {provider.fullName}
            </Link>

            {/* Avaliação em Estrelas */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-slate-900 text-sm">{provider.ratingAvg.toFixed(1)}</span>
              <span className="text-slate-400 text-xs">({provider.reviewsCount} avaliações)</span>
            </div>
          </div>
        </div>

        {/* Bio resumida */}
        <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed mb-4 flex-1">
          {provider.bio}
        </p>

        {/* Metadados: Experiência e Cidades */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{provider.yearsExperience} anos de experiência comprovada</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 font-medium">Atende:</span>
            {provider.citiesServed.slice(0, 3).map((cidade) => (
              <span key={cidade} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                {cidade}
              </span>
            ))}
            {provider.citiesServed.length > 3 && (
              <span className="text-[10px] text-slate-400">+{provider.citiesServed.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/profissional/${provider.id}`}
          onClick={handleProfileClick}
          className="flex-1 text-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Ver Perfil</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          onClick={handleWhatsAppClick}
          className="flex-[1.4] bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-600/20"
        >
          <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
          <span>Chamar WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
