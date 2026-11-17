'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Settings,
  Star,
  ExternalLink,
  HardHat,
  AlertCircle,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeRole, switchRole } = useApp();

  const navItems = [
    { label: 'Visão Geral (Dashboard)', href: '/admin', icon: LayoutDashboard },
    { label: 'Gestão de Profissionais', href: '/admin/profissionais', icon: Users },
    { label: 'Lojas & Banners B2B', href: '/admin/lojas', icon: Building2 },
    { label: 'Financeiro & Assinaturas', href: '/admin/financeiro', icon: DollarSign },
    { label: 'Categorias & Cidades', href: '/admin/configuracoes', icon: Settings },
    { label: 'Moderação de Avaliações', href: '/admin/avaliacoes', icon: Star },
  ];

  if (activeRole !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Acesso Restrito ao Administrador</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta área é exclusiva para a conta de Administrador Mestre do sistema Tá Na Mão.
          </p>
          <div className="pt-2">
            <button
              onClick={() => switchRole('admin')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Alternar para Perfil de Administrador Mestre</span>
            </button>
          </div>
          <Link
            href="/"
            className="block text-xs text-slate-500 hover:text-slate-300 font-medium"
          >
            Voltar para o site público
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR ADMIN */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Backoffice */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <HardHat className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  TÁ NA <span className="text-amber-400">MÃO</span>
                </span>
                <span className="block text-[10px] text-amber-500 uppercase tracking-widest font-bold">
                  Painel Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Menus de Navegação */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              HC
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-white truncate">
                Henrique Carreto
              </span>
              <span className="block text-[10px] text-emerald-400 font-medium">
                Admin Mestre
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs transition border border-slate-700"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DO ADMIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tá Na Mão Backoffice</span>
            <span>/</span>
            <span className="font-bold text-slate-800">Área de Administração Regional</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Sistema Online (SP)</span>
          </div>
        </header>

        <div className="p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
