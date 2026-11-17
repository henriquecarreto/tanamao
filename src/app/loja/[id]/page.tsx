'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  MapPin,
  MessageCircle,
  Tag,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function LojaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { stores, registerClick } = useApp();

  const storeId = params?.id as string;
  const store = stores.find((s) => s.id === storeId) || stores[0];

  const handleWhatsApp = (productName?: string) => {
    registerClick(store.id, 'banner_click');
    const msg = productName
      ? encodeURIComponent(
          `Olá! Vi a oferta de "${productName}" da ${store.companyName} no portal Tá Na Mão e gostaria de saber se tem a pronta entrega!`
        )
      : encodeURIComponent(
          `Olá! Gostaria de fazer uma cotação de materiais na ${store.companyName} através do portal Tá Na Mão.`
        );
    window.open(`https://wa.me/55${store.phoneWhatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </div>

          {/* CAPA DA LOJA */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl">
            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src={store.bannerUrl}
                alt={store.companyName}
                fill
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 -mt-24 sm:-mt-28 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Loja Parceira Oficial Tá Na Mão</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {store.companyName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{store.address} ({store.city} - SP)</span>
                  </div>
                  {store.cnpj && <span>• CNPJ: {store.cnpj}</span>}
                  <span>• Cidades Atendidas: {store.citiesTargeted.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={() => handleWhatsApp()}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl transition flex items-center gap-2.5 text-sm shrink-0"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Chamar Balcão de Vendas</span>
              </button>
            </div>
          </div>

          {/* GRADE DE OFERTAS DA SEMANA */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Tag className="w-6 h-6 text-amber-500" />
                  Ofertas da Semana com Desconto Especial
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Materiais e ferramentas a pronta entrega na loja
                </p>
              </div>
            </div>

            {store.offers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                Nenhuma promoção ativa cadastrada no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div>
                      {offer.imageUrl && (
                        <div className="relative h-48 w-full bg-slate-200">
                          <Image
                            src={offer.imageUrl}
                            alt={offer.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {offer.productName}
                        </h3>

                        {/* Preço de Oferta */}
                        <div className="space-y-1">
                          {offer.originalPrice && (
                            <span className="text-xs text-slate-400 line-through block">
                              De R$ {offer.originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-amber-600">
                              R$ {offer.promotionalPrice.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Preço Oferta
                            </span>
                          </div>
                        </div>

                        {offer.validUntil && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>Válido até: {offer.validUntil}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100">
                      <button
                        onClick={() => handleWhatsApp(offer.productName)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                        <span>Garantir Preço no WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
