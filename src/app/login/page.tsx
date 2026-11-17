'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { HardHat, ShieldCheck, Building2, User, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      switchRole('admin');
      router.push('/admin');
    } else {
      switchRole('provider');
      router.push('/painel');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'provider' | 'store') => {
    switchRole(role);
    if (role === 'admin') router.push('/admin');
    else router.push('/painel');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mx-auto mb-4 shadow-md">
              <HardHat className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Acessar sua Conta
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie seus anúncios, visualizações e contatos de WhatsApp
            </p>
          </div>

          {/* ACESSO RÁPIDO PARA DEMO */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-2.5">
            <span className="text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Acesso Rápido de Teste (1 Clique):
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Entrar como Administrador Mestre
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('provider')}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1.5">
                  <HardHat className="w-4 h-4 text-amber-600" />
                  Entrar como Prestador (Marcos Eletricista)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('store')}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  Entrar como Loja Parceira (ConstruVale)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs">ou entre com seus dados</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Entrar no Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Ainda não tem conta?{' '}
            <Link href="/anuncie" className="font-bold text-amber-600 hover:underline">
              Cadastre-se com 30 Dias Grátis &rarr;
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
