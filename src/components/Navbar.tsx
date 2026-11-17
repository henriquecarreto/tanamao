'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  HardHat,
  Search,
  Tag,
  Sparkles,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { selectedCity, setSelectedCity, cities, currentUser, activeRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCurrentActive = (path: string) => pathname === path;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-7 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <HardHat className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                  TÁ NA <span className="text-amber-400">MÃO</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Construção & Reformas
                </span>
              </div>
            </Link>

            {/* Seletor de Cidade em Destaque */}
            <div className="hidden md:flex items-center bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <span className="text-slate-400 mr-1">Região:</span>
              <div className="relative inline-block">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="Todas as Cidades" className="bg-slate-900 text-white">
                    Todas as Cidades
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name} className="bg-slate-900 text-white">
                      {city.name} - SP
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-amber-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/explorar"
              className={`flex items-center gap-1.5 transition ${
                isCurrentActive('/explorar')
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" />
              Buscar Profissionais
            </Link>

            <Link
              href="/loja/store-01"
              className={`flex items-center gap-1.5 transition ${
                isCurrentActive('/loja/store-01')
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4 text-amber-400" />
              Ofertas de Materiais
            </Link>

            <Link
              href="/anuncie"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Anuncie seu Serviço
              <span className="bg-slate-950 text-amber-400 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ml-1">
                30 Dias Grátis
              </span>
            </Link>
          </nav>

          {/* User / Panel CTA Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {activeRole === 'admin' ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-lg text-sm font-medium transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Painel Admin</span>
              </Link>
            ) : currentUser ? (
              <Link
                href="/painel"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3.5 py-2 rounded-lg text-sm font-medium transition"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Meu Painel</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
              >
                <User className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile City Selector */}
        <div className="md:hidden py-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
            <span>Sua Cidade:</span>
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-800 text-amber-300 font-semibold py-1 px-2.5 rounded border border-slate-700 text-xs"
          >
            <option value="Todas as Cidades">Todas as Cidades</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name} - SP
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/explorar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Buscar Profissionais
          </Link>
          <Link
            href="/loja/store-01"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Ofertas de Materiais de Construção
          </Link>
          <Link
            href="/anuncie"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-amber-400"
          >
            Anuncie seu Serviço (30 Dias Grátis)
          </Link>
          <div className="pt-2 border-t border-slate-800">
            {activeRole === 'admin' ? (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg"
              >
                <ShieldCheck className="w-5 h-5" />
                Painel do Administrador
              </Link>
            ) : currentUser ? (
              <Link
                href="/painel"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-2.5 rounded-lg border border-slate-700"
              >
                <User className="w-5 h-5 text-amber-400" />
                Acessar Meu Painel
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg"
              >
                <User className="w-5 h-5" />
                Fazer Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
