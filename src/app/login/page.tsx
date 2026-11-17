'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  HardHat,
  ShieldCheck,
  Building2,
  User,
  ArrowRight,
  Sparkles,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');
  const { switchRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | 'store'>('provider');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    authError ? 'Falha no link de autenticação. Por favor, entre com seu e-mail e senha.' : ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  // Trata redirecionamento oficial por papel:
  // "Clientes são direcionados à busca. Prestadores e lojas vão ao painel de anúncios.
  // O papel de administrador é atribuído diretamente pelo responsável pelo banco a uma conta já cadastrada."
  const redirectByRole = (role: string) => {
    if (role === 'admin') {
      switchRole('admin');
      router.push('/admin');
    } else if (role === 'store') {
      switchRole('store');
      router.push('/painel');
    } else if (role === 'provider') {
      switchRole('provider');
      router.push('/painel');
    } else {
      switchRole('customer');
      router.push('/explorar');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        if (mode === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Consulta o perfil e papel oficial na tabela profiles
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .single();

            const role = profile?.role || data.user.user_metadata?.role || 'customer';
            redirectByRole(role);
          }
        } else {
          // Cadastro no Supabase Auth com metadados
          // IMPORTANTE: role é limitado a 'customer', 'provider' ou 'store' (nunca admin)
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: selectedRole,
                full_name: fullName,
                phone_whatsapp: phone,
              },
              emailRedirectTo: `${siteUrl}/auth/callback`,
            },
          });

          if (error) throw error;

          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch {}

          if (data.session) {
            redirectByRole(selectedRole);
          } else {
            setSuccessMessage(
              'Conta criada com sucesso! Verifique seu e-mail para confirmar seu cadastro ou realize o login.'
            );
            setMode('login');
          }
        }
      } else {
        // Modo Demonstração Local (Sem Supabase conectado)
        if (mode === 'login') {
          if (email.includes('admin')) {
            redirectByRole('admin');
          } else if (email.includes('loja') || email.includes('store')) {
            redirectByRole('store');
          } else if (email.includes('cliente') || email.includes('customer')) {
            redirectByRole('customer');
          } else {
            redirectByRole('provider');
          }
        } else {
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch {}
          redirectByRole(selectedRole);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro na autenticação. Verifique os dados digitados.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'provider' | 'store' | 'customer') => {
    redirectByRole(role);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mx-auto mb-4 shadow-md">
              <HardHat className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? 'Acessar sua Conta' : 'Criar Nova Conta'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? 'Entre para gerenciar seus anúncios, contatos e buscas'
                : 'Cadastre-se na plataforma nacional Tá Na Mão'}
            </p>
          </div>

          {/* Abas Alternar Login / Cadastro */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Já tenho conta
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ACESSO RÁPIDO PARA TESTE */}
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Atalhos de Demonstração (1 Clique):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickLogin('provider')}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1 truncate">
                  <HardHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Prestador
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('store')}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Loja
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1 truncate">
                  <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  Cliente
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Admin
                </span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
            </div>
          </div>

          {/* FORMULÁRIO DE AUTENTICAÇÃO */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tipo de Conta
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('provider')}
                      className={`p-2 rounded-xl text-center border transition text-[11px] font-bold ${
                        selectedRole === 'provider'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HardHat className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                      Prestador
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('store')}
                      className={`p-2 rounded-xl text-center border transition text-[11px] font-bold ${
                        selectedRole === 'store'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                      Loja
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`p-2 rounded-xl text-center border transition text-[11px] font-bold ${
                        selectedRole === 'customer'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                      Cliente
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome Completo / Razão Social
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="João da Silva"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    WhatsApp (com DDD)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(18) 99765-4321"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Nota Oficial sobre Administradores */}
          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span>
              Clientes são direcionados à busca. Prestadores e lojas vão ao painel de anúncios. O papel de administrador é atribuído diretamente pelo responsável pelo banco a uma conta já cadastrada.
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Carregando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
