'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LocationModal } from '@/components/LocationModal';
import {
  MapPin,
  HardHat,
  Search,
  Building2,
  Sparkles,
  User,
  ShieldCheck,
  Menu,
  X,
  Crosshair,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { clientLocation, currentUser, activeRole, logout } = useApp();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCurrentActive = (path: string) => pathname === path;

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-7 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Tá Na Mão */}
            <div className="flex items-center gap-5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                  <HardHat className="w-6 h-6 text-slate-950 font-bold" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                    TÁ NA <span className="text-amber-400">MÃO</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Portal Nacional da Construção
                  </span>
                </div>
              </Link>

              {/* Seletor Inteligente de Localização Nacional (GPS / CEP / IBGE) */}
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="hidden md:flex items-center bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-500/50 rounded-full px-3.5 py-1.5 text-xs transition group cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0 group-hover:scale-110 transition" />
                <div className="flex flex-col text-left mr-2">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    Onde você está:
                  </span>
                  <span className="text-amber-300 font-bold max-w-[170px] truncate">
                    {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
                    {clientLocation.city} - {clientLocation.state}
                  </span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">
                  Alterar
                </span>
              </button>
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
                Encontrar Profissionais
              </Link>

              <Link
                href="/loja/store-01"
                className={`flex items-center gap-1.5 transition ${
                  isCurrentActive('/loja/store-01')
                    ? 'text-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                Lojas Parceiras
              </Link>

              <Link
                href="/anuncie"
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-4 py-2 rounded-xl shadow-md hover:shadow-amber-500/20 transition transform hover:-translate-y-0.5 text-xs"
              >
                <Sparkles className="w-4 h-4" />
                Sou Profissional
                <span className="bg-slate-950 text-amber-400 text-[10px] font-black uppercase px-1.5 py-0.5 rounded ml-1">
                  30 Dias Grátis
                </span>
              </Link>
            </nav>

            {/* User / Panel CTA Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {activeRole === 'admin' ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Painel Admin SaaS</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    title="Encerrar Sessão"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : currentUser ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/painel"
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Meu Painel</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    title="Encerrar Sessão"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  <User className="w-4 h-4" />
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="p-1.5 rounded-lg bg-slate-800 text-amber-400 border border-slate-700"
                title="Alterar Localização"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Localização Barra Rápida */}
          <div className="md:hidden py-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center text-slate-300 truncate font-semibold"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <span className="truncate">
                {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
                {clientLocation.city} - {clientLocation.state}
              </span>
            </button>
            <button
              onClick={() => setLocationModalOpen(true)}
              className="text-[10px] bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded border border-slate-700 shrink-0 ml-2"
            >
              Mudar Local
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <Link
              href="/explorar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-300 hover:text-white"
            >
              Encontrar Profissionais Próximos
            </Link>
            <Link
              href="/loja/store-01"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-300 hover:text-white"
            >
              Lojas Parceiras Institucionais
            </Link>
            <Link
              href="/anuncie"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-black text-amber-400"
            >
              Sou Profissional (30 Dias Grátis)
            </Link>
            <div className="pt-2 border-t border-slate-800">
              {activeRole === 'admin' ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Painel Admin SaaS
                </Link>
              ) : currentUser ? (
                <Link
                  href="/painel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs border border-slate-700"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  Acessar Meu Painel
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
                >
                  <User className="w-4 h-4" />
                  Fazer Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modal Nacional de Localização */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
};
