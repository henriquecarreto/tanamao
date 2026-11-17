'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  Check,
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

  // Redirecionamento por perfil
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
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .single();

            const role = profile?.role || data.user.user_metadata?.role || 'customer';
            redirectByRole(role);
          }
        } else {
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
        // Modo Demonstração
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      {/* ========================================================= */}
      {/* LADO 1: FORMULÁRIO DE LOGIN (COM BOTÃO VERDE) */}
      {/* ========================================================= */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-white shadow-xl lg:shadow-none z-10">
        {/* Topo: Marca Tá Na Mão */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black shadow-md border border-slate-800">
              <HardHat className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                Tá Na Mão
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Plataforma de Construção & Reformas
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Área Logada
          </span>
        </div>

        {/* Centro: Formulário com o Botão Verde */}
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'login'
                ? 'Conecte-se para buscar profissionais ou gerenciar seus anúncios.'
                : 'Cadastre-se para divulgar seus serviços na sua região.'}
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
              className={`flex-1 py-2.5 rounded-xl transition ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl transition ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Mensagens de Erro ou Sucesso */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORMULÁRIO */}
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
                      className={`p-2.5 rounded-xl text-center border transition text-[11px] font-bold ${
                        selectedRole === 'provider'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <HardHat className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      Prestador
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('store')}
                      className={`p-2.5 rounded-xl text-center border transition text-[11px] font-bold ${
                        selectedRole === 'store'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                      Loja
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`p-2.5 rounded-xl text-center border transition text-[11px] font-bold ${
                        selectedRole === 'customer'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
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
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="João da Silva"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
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
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* BOTÃO VERDE APROVADO */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* ACESSO RÁPIDO PARA DEMO (1 CLIQUE) */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1.5 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Acesso Rápido para Teste:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickLogin('provider')}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
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
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
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
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 py-2 px-2.5 rounded-xl flex items-center justify-between transition shadow-sm"
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

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span>
              Clientes são direcionados à busca. Prestadores e lojas vão ao painel de anúncios. O papel de administrador é atribuído diretamente pelo responsável pelo banco a uma conta já cadastrada.
            </span>
          </div>
        </div>

        {/* Rodapé */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>© 2026 Tá Na Mão</span>
          <span className="text-emerald-700 font-bold">Plataforma Segura</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LADO 2: A FOTO (entrada.jpg) COM DESTAQUE INSTITUCIONAL */}
      {/* ========================================================= */}
      <div className="hidden lg:relative lg:flex flex-col justify-end p-12 xl:p-16 bg-slate-950 overflow-hidden min-h-screen">
        <Image
          src="/entrada.jpg"
          alt="Construção e Reformas Tá Na Mão"
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-lg text-white">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase px-3 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rede Nacional de Construção Civil</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
            Conectando profissionais qualificados a quem precisa construir ou reformar.
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Sem intermediários e sem cobrança de comissões por obra. O cliente encontra seu perfil por geolocalização e fala direto no seu WhatsApp.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-xl font-black text-amber-400">5.570</span>
              <span className="text-[10px] text-slate-300 font-semibold uppercase">Municípios</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-xl font-black text-emerald-400">100%</span>
              <span className="text-[10px] text-slate-300 font-semibold uppercase">WhatsApp Direto</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-xl font-black text-white">30 Dias</span>
              <span className="text-[10px] text-slate-300 font-semibold uppercase">Grátis para Testar</span>
            </div>
          </div>
        </div>
      </div>
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
