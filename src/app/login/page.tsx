'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  HardHat,
  ArrowRight,
  Mail,
  Lock,
  Phone,
  User,
  Building2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Briefcase,
  MapPin,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');
  const { setCurrentUser } = useApp();

  // Modos da tela: 'login' | 'register'
  const [viewMode, setViewMode] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'customer' | 'provider' | 'store'>('customer');

  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos de Cadastro
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    authError ? 'Falha no link de autenticação. Por favor, entre com suas credenciais.' : ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  // Abre o formulário de cadastro com o tipo de conta já definido
  const openRegister = (type: 'customer' | 'provider' | 'store') => {
    setAccountType(type);
    setViewMode('register');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Redirecionamento por papel após autenticação
  const handleAuthRedirect = (role: string) => {
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'provider' || role === 'store') {
      router.push('/painel');
    } else {
      router.push('/explorar');
    }
  };

  // Submissão do Formulário de Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (error) throw error;

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const role = profile?.role || data.user.user_metadata?.role || 'customer';
          const userObj = {
            id: data.user.id,
            role,
            fullName: profile?.full_name || data.user.email?.split('@')[0] || 'Usuário',
            email: data.user.email || loginEmail,
            phoneWhatsapp: profile?.phone_whatsapp || '',
            isBlocked: profile?.is_blocked || false,
            createdAt: profile?.created_at || new Date().toISOString(),
          };

          setCurrentUser(userObj);
          try {
            localStorage.setItem('tnm_user_v2', JSON.stringify(userObj));
          } catch {}

          handleAuthRedirect(role);
        }
      } else {
        // Modo local com validação
        let role: 'customer' | 'provider' | 'store' | 'admin' = 'customer';
        if (loginEmail.toLowerCase().includes('admin')) {
          role = 'admin';
        } else if (loginEmail.toLowerCase().includes('loja') || loginEmail.toLowerCase().includes('empresa')) {
          role = 'store';
        } else if (loginEmail.toLowerCase().includes('prestador') || loginEmail.toLowerCase().includes('pedreiro')) {
          role = 'provider';
        }

        const userObj = {
          id: `usr-${Date.now()}`,
          role,
          fullName: loginEmail.split('@')[0],
          email: loginEmail,
          phoneWhatsapp: '',
          isBlocked: false,
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(userObj);
        try {
          localStorage.setItem('tnm_user_v2', JSON.stringify(userObj));
        } catch {}

        handleAuthRedirect(role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Formulário de Cadastro (Supabase Auth)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const targetRole = accountType;
      const computedName = targetRole === 'store' ? companyName || fullName : fullName;

      if (isSupabaseConfigured && supabase) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const { data, error } = await supabase.auth.signUp({
          email: registerEmail,
          password: registerPassword,
          options: {
            data: {
              role: targetRole,
              full_name: computedName,
              phone_whatsapp: phone,
              city,
              cep,
              specialty: targetRole === 'provider' ? specialty : undefined,
              company_name: targetRole === 'store' ? companyName : undefined,
            },
            emailRedirectTo: `${siteUrl}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.session && data.user) {
          const userObj = {
            id: data.user.id,
            role: targetRole,
            fullName: computedName,
            email: registerEmail,
            phoneWhatsapp: phone,
            isBlocked: false,
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(userObj);
          try {
            localStorage.setItem('tnm_user_v2', JSON.stringify(userObj));
          } catch {}
          handleAuthRedirect(targetRole);
        } else {
          setSuccessMessage(
            'Cadastro realizado com sucesso! Verifique seu e-mail para confirmação ou faça login.'
          );
          setViewMode('login');
          setLoginEmail(registerEmail);
        }
      } else {
        // Fallback local
        const userObj = {
          id: `usr-${Date.now()}`,
          role: targetRole,
          fullName: computedName,
          email: registerEmail,
          phoneWhatsapp: phone,
          isBlocked: false,
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(userObj);
        try {
          localStorage.setItem('tnm_user_v2', JSON.stringify(userObj));
        } catch {}

        handleAuthRedirect(targetRole);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao processar o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* ========================================================================= */}
      {/* LADO ESQUERDO: FORMULÁRIO (Fundo branco, verde-escuro #155C4D nos botões) */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 bg-white">
        {/* Marca Tá na Mão */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#155C4D] text-white flex items-center justify-center font-black shadow-sm">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Tá na Mão
          </span>
        </div>

        {/* ===================================================================== */}
        {/* MODO 1: TELA INICIAL COM LOGIN E SEÇÃO CRIAR CONTA COM 3 BOTÕES       */}
        {/* ===================================================================== */}
        {viewMode === 'login' ? (
          <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Entre na sua conta
              </h1>
            </div>

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

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#155C4D] font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#155C4D] font-medium transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#155C4D] hover:bg-[#10473b] active:bg-[#0c382e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* SEÇÃO "Criar conta" COM EXATAMENTE TRÊS BOTÕES: Cliente, Prestador e Empresa */}
            <div className="pt-6 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-500 mb-3 text-center uppercase tracking-wider">
                Criar conta
              </span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => openRegister('customer')}
                  className="w-full py-3 px-2 rounded-xl border border-slate-200 hover:border-[#155C4D] hover:bg-slate-50 text-slate-800 hover:text-[#155C4D] font-bold text-xs transition text-center cursor-pointer flex flex-col items-center gap-1 shadow-sm"
                >
                  <User className="w-4 h-4 text-[#155C4D]" />
                  <span>Cliente</span>
                </button>

                <button
                  type="button"
                  onClick={() => openRegister('provider')}
                  className="w-full py-3 px-2 rounded-xl border border-slate-200 hover:border-[#155C4D] hover:bg-slate-50 text-slate-800 hover:text-[#155C4D] font-bold text-xs transition text-center cursor-pointer flex flex-col items-center gap-1 shadow-sm"
                >
                  <HardHat className="w-4 h-4 text-[#155C4D]" />
                  <span>Prestador</span>
                </button>

                <button
                  type="button"
                  onClick={() => openRegister('store')}
                  className="w-full py-3 px-2 rounded-xl border border-slate-200 hover:border-[#155C4D] hover:bg-slate-50 text-slate-800 hover:text-[#155C4D] font-bold text-xs transition text-center cursor-pointer flex flex-col items-center gap-1 shadow-sm"
                >
                  <Building2 className="w-4 h-4 text-[#155C4D]" />
                  <span>Empresa</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* MODO 2: FORMULÁRIO DE CADASTRO COM O TIPO DE CONTA JÁ DEFINIDO      */
          /* =================================================================== */
          <div className="my-auto py-6 max-w-md w-full mx-auto space-y-5">
            <button
              type="button"
              onClick={() => {
                setViewMode('login');
                setErrorMessage('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#155C4D] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o login</span>
            </button>

            <div>
              <span className="inline-block bg-slate-100 text-[#155C4D] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-2">
                Tipo de Conta:{' '}
                {accountType === 'customer'
                  ? 'Cliente'
                  : accountType === 'provider'
                  ? 'Prestador'
                  : 'Empresa'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {accountType === 'customer'
                  ? 'Cadastro de Cliente'
                  : accountType === 'provider'
                  ? 'Cadastro de Prestador'
                  : 'Cadastro de Empresa'}
              </h1>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {accountType === 'store' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome da Empresa / Razão Social
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Comercial Vale Materiais"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                    />
                  </div>
                </div>
              )}

              {accountType === 'provider' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Especialidade Principal
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ex: Pedreiro, Eletricista, Pintor"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    WhatsApp (com DDD)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(18) 99765-4321"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cidade / UF
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Palmital - SP"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#155C4D] font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#155C4D] hover:bg-[#10473b] active:bg-[#0c382e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <>
                    <span>Criar Conta</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setViewMode('login')}
                className="text-xs font-bold text-slate-500 hover:text-[#155C4D] transition"
              >
                Já possui uma conta? <span className="underline">Entrar</span>
              </button>
            </div>
          </div>
        )}

        {/* Rodapé limpo */}
        <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          <span>© Tá na Mão</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LADO DIREITO: FOTO ORIGINAL (public/entrada-construcao.jpg)                */}
      {/* Exibe APENAS a fotografia, sem faixas, sem selos e sem textos sobrepostos  */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full h-full min-h-screen bg-slate-900">
        <Image
          src="/entrada-construcao.jpg"
          alt="Tá na Mão - Arquitetura e Construção"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-bold text-slate-400">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
