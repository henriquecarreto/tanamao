'use client';

import React from 'react';
import Link from 'next/link';
import { HardHat, MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Footer: React.FC = () => {
  const { clientLocation } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
                <HardHat className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                TÁ NA <span className="text-amber-400">MÃO</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              O maior portal nacional da construção civil, reformas e prestadores de serviços geolocalizados. Conectando clientes aos profissionais mais próximos de qualquer rua ou bairro do Brasil.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero comissão sobre suas obras. Contato direto!</span>
            </div>
          </div>

          {/* Coluna 2: Sua Localização e Regiões */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <MapPin className="w-4 h-4 text-amber-400" />
              Sua Região Ativa
            </h4>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs space-y-1 mb-3">
              <span className="text-amber-400 font-bold block">
                {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
                {clientLocation.city} - {clientLocation.state}
              </span>
              <span className="text-[11px] text-slate-400 block">
                Coordenadas: {clientLocation.latitude.toFixed(2)}, {clientLocation.longitude.toFixed(2)}
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Palmital, Assis, Tarumã e Cândido Mota</li>
              <li>São Paulo Capital e Grande SP</li>
              <li>Todos os 27 Estados e 5.570 Municípios</li>
            </ul>
          </div>

          {/* Coluna 3: Categorias em Alta */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-xs">
              Serviços Mais Buscados
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explorar?cat=pedreiro" className="hover:text-amber-400 transition">
                  Pedreiros e Alvenaria Estrutural
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=eletricista" className="hover:text-amber-400 transition">
                  Eletricistas e Padrão de Entrada
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=encanador" className="hover:text-amber-400 transition">
                  Encanadores e Caça-Vazamentos
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=pintor" className="hover:text-amber-400 transition">
                  Pintores e Efeitos Marmorizados
                </Link>
              </li>
              <li>
                <Link href="/explorar?cat=gesseiro" className="hover:text-amber-400 transition">
                  Gesso, Drywall e Sancas com LED
                </Link>
              </li>
              <li>
                <Link href="/loja/store-01" className="hover:text-amber-400 transition text-amber-300 font-semibold">
                  Lojas e Depósitos Parceiros
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Para Profissionais & Suporte */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider text-xs">
              Para Prestadores & Lojas
            </h4>
            <p className="text-xs text-slate-400">
              Quer receber chamadas de obras no seu WhatsApp?
            </p>
            <Link
              href="/anuncie"
              className="inline-block w-full text-center bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-4 py-2.5 rounded-xl border border-amber-500/30 text-xs transition"
            >
              Começar 30 Dias Grátis &rarr;
            </Link>
            <div className="pt-2 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>WhatsApp Suporte: (18) 99700-0001</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>contato@tanamao.com.br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Tá Na Mão — Portal Nacional da Construção Civil & Geolocalização Brasil. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span>Desenvolvido para atender todo o território brasileiro</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
