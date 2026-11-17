'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
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
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, logout } = useApp();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const navItems = [
    { label: 'Visão Geral (Dashboard)', href: '/admin', icon: LayoutDashboard },
    { label: 'Gestão de Profissionais', href: '/admin/profissionais', icon: Users },
    { label: 'Lojas & Banners B2B', href: '/admin/lojas', icon: Building2 },
    { label: 'Financeiro & Assinaturas', href: '/admin/financeiro', icon: DollarSign },
    { label: 'Categorias & Cidades', href: '/admin/configuracoes', icon: Settings },
    { label: 'Moderação de Avaliações', href: '/admin/avaliacoes', icon: Star },
  ];

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (error) throw error;

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name, is_blocked')
            .eq('id', data.user.id)
            .single();

          if (profile?.role !== 'admin' || profile?.is_blocked) {
            await supabase.auth.signOut();
            throw new Error('Acesso negado: esta conta não possui permissão de administrador.');
          }

          const adminUser = {
            id: data.user.id,
            role: 'admin' as const,
            fullName: profile?.full_name || 'Administrador',
            email: data.user.email || adminEmail,
            phoneWhatsapp: '',
            isBlocked: false,
            createdAt: new Date().toISOString(),
          };

          setCurrentUser(adminUser);
          try {
            localStorage.setItem('tnm_user_v2', JSON.stringify(adminUser));
          } catch {}
        }
      } else {
        // Validação local estrita
        if (!adminEmail.toLowerCase().includes('admin')) {
          throw new Error('Acesso negado: apenas contas com papel de administrador podem acessar este painel.');
        }

        const adminUser = {
          id: 'usr-admin-master',
          role: 'admin' as const,
          fullName: 'Administrador Mestre',
          email: adminEmail,
          phoneWhatsapp: '',
          isBlocked: false,
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(adminUser);
        try {
          localStorage.setItem('tnm_user_v2', JSON.stringify(adminUser));
        } catch {}
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erro na autenticação de administrador.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Se estiver logado com conta comum (cliente, prestador ou loja): ACESSO NEGADO!
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Acesso Negado</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sua conta atual (<span className="text-white font-bold">{currentUser.email}</span> — Papel:{' '}
            <span className="text-amber-400 uppercase font-bold">{currentUser.role}</span>) não possui permissão de administrador.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full bg-[#155C4D] hover:bg-[#10473b] text-white font-bold py-3 px-4 rounded-xl text-xs transition text-center"
            >
              Voltar para o Início
            </Link>
            <button
              onClick={() => {
                logout();
                window.location.reload();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
            >
              Sair desta conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Se não estiver logado: Formulário de login direto para o administrador
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#155C4D] text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">Área Administrativa Restrita</h2>
            <p className="text-xs text-slate-400">
              Acesso exclusivo para administradores validados no servidor.
            </p>
          </div>

          {authError && (
            <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                E-mail do Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@tanamao.com.br"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#155C4D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#155C4D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#155C4D] hover:bg-[#10473b] active:bg-[#0c382e] text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando permissão...</span>
                </>
              ) : (
                <>
                  <span>Entrar na Administração</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              &larr; Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Se autenticado como administrador: Renderiza o painel completo
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR ADMIN */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Backoffice */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#155C4D] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-black text-white text-base tracking-tight">
                Tá Na Mão <span className="text-[#2dd4bf] text-xs font-normal">Admin</span>
              </span>
            </div>
          </div>

          {/* Menus de Navegação */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#155C4D] text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-3 py-2 bg-slate-800/60 rounded-xl text-xs">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Logado como:</span>
            <span className="text-white font-bold truncate block">{currentUser.email}</span>
            <span className="text-[#2dd4bf] text-[10px] font-semibold">Administrador Mestre</span>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-bold rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DO BACKOFFICE */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
