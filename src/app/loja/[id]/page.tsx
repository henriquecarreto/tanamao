'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  MapPin,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Navigation,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export default function LojaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { stores, registerClick } = useApp();

  const storeId = params?.id as string;
  const store = stores.find((s) => s.id === storeId) || stores[0];

  const handleWhatsApp = () => {
    registerClick(store.id, 'banner_click');
    const msg = encodeURIComponent(
      `Olá! Vi o anúncio institucional da ${store.companyName} no portal Tá Na Mão e gostaria de fazer uma cotação de materiais para minha obra!`
    );
    window.open(`https://wa.me/55${store.phoneWhatsapp}?text=${msg}`, '_blank');
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${store.companyName}, ${store.street}, ${store.city} - ${store.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
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

          {/* CAPA INSTITUCIONAL DA LOJA */}
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
                <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Loja Parceira Anunciante Tá Na Mão</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {store.companyName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>
                      {store.street ? `${store.street}, ` : ''}{store.city} - {store.state}
                    </span>
                  </div>
                  {store.cnpj && <span>• CNPJ: {store.cnpj}</span>}
                  <span>• Raio de Entrega: até {store.coverageRadiusKm} km</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={handleOpenMap}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3.5 rounded-2xl border border-slate-700 transition flex items-center gap-2 text-xs"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Traçar Rota no Mapa</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition flex items-center gap-2 text-xs"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Chamar Balcão no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* SOBRE A LOJA & ÁREA DE ATUAÇÃO INSTITUCIONAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-6 h-6 text-amber-500" />
                Sobre a Empresa e Linhas de Materiais
              </h2>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {store.description}
              </p>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Categorias e Soluções Disponíveis na Loja:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    'Cimentos & Argamassas',
                    'Aço & Ferragens Estruturais',
                    'Tijolos & Blocos',
                    'Pisos & Porcelanatos Retificados',
                    'Tubos & Conexões Hidráulicas',
                    'Fios & Materiais Elétricos',
                    'Tintas & Acessórios de Pintura',
                    'Telhas & Madeiramento',
                    'Ferramentas Manuais & Elétricas',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD LATERAL: ENDEREÇO & CONTATO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-black text-base text-slate-900">
                  Endereço & Atendimento
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">{store.companyName}</strong>
                      <span>{store.street || 'Endereço Comercial'}</span>
                      <span className="block">{store.neighborhood ? `${store.neighborhood}, ` : ''}{store.city} - {store.state}</span>
                      <span className="block text-slate-400">CEP: {store.cep}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Raio de entrega e frete: até <strong>{store.coverageRadiusKm} km</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Falar com o Vendedor no WhatsApp</span>
                </button>

                <button
                  onClick={handleOpenMap}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-slate-600" />
                  <span>Abrir Rota no Google Maps / Waze</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
