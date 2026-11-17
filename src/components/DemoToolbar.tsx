'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, HardHat, Building2, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export const DemoToolbar: React.FC = () => {
  const { activeRole, switchRole } = useApp();
  const pathname = usePathname();

  // Mantém a tela de login 100% limpa com o layout aprovado
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <div className="bg-slate-900 border-b border-amber-500/30 text-xs text-slate-200 py-1.5 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Modo Demonstração Ativo:
          </span>
          <span className="text-slate-400 hidden sm:inline">Alternar perfil de teste:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Mestre
          </button>

          <button
            onClick={() => switchRole('provider')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeRole === 'provider'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            Prestador (Trial 23d)
          </button>

          <button
            onClick={() => switchRole('store')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeRole === 'store'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Loja B2B
          </button>

          <button
            onClick={() => switchRole('customer')}
            className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeRole === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Visitante
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeRole === 'admin' && (
            <Link
              href="/admin"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-2.5 py-0.5 rounded text-xs flex items-center gap-1 transition"
            >
              Abrir Painel Admin <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          {(activeRole === 'provider' || activeRole === 'store') && (
            <Link
              href="/painel"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-2.5 py-0.5 rounded text-xs flex items-center gap-1 transition"
            >
              Abrir Meu Painel <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
