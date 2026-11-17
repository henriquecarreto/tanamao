'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  Sparkles,
  Check,
  Building2,
  HardHat,
  ArrowRight,
  Gift,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AnunciePage() {
  const router = useRouter();
  const { categories, switchRole } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'provider' | 'store_basic' | 'store_featured'>('provider');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cep, setCep] = useState('');
  const [city, setCity] = useState('Palmital');
  const [category, setCategory] = useState('pedreiro');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch { }

    const targetRole = selectedPlan.startsWith('store') ? 'store' : 'provider';

    if (isSupabaseConfigured && supabase) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        await supabase.auth.signUp({
          email,
          password: password || 'Tanamao@2026',
          options: {
            data: {
              role: targetRole,
              full_name: fullName,
              phone_whatsapp: phone,
              cep,
              company_name: fullName,
            },
            emailRedirectTo: `${siteUrl}/auth/callback`,
          },
        });
      } catch (err) {
        console.error('Erro no cadastro Supabase:', err);
      }
    }

    setTimeout(() => {
      switchRole(targetRole);
      router.push('/painel?status=welcome');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase px-4 py-1.5 rounded-full">
              <Gift className="w-4 h-4" />
              <span>Campanha Nacional — 30 Dias Grátis Automáticos para Prestadores</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Seja encontrado por quem precisa de obra{' '}
              <span className="text-amber-400">na sua rua, bairro e cidade.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-300 text-xs sm:text-base leading-relaxed">
              Sem taxas e sem intermediação. O cliente clica e fala direto no seu WhatsApp. Escolha o seu plano abaixo e ative sua conta em segundos.
            </p>
          </div>
        </section>

        {/* COMPARATIVO DE PLANOS */}
        <section className="py-14 -mt-10 px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PLANO AUTÔNOMO */}
            <div
              onClick={() => setSelectedPlan('provider')}
              className={`rounded-3xl p-7 border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${selectedPlan === 'provider'
                ? 'border-amber-500 shadow-2xl ring-4 ring-amber-500/10'
                : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              {selectedPlan === 'provider' && (
                <span className="absolute -top-3 left-6 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Para Prestadores
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Prestador Autônomo</h3>
                    <p className="text-[11px] text-slate-500">Pedreiro, Eletricista, Pintor, etc.</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
                  <span className="text-[11px] font-black text-amber-800 uppercase tracking-wide block">
                    🎁 Primeiro Mês 100% Grátis
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900">GRÁTIS</span>
                    <span className="text-xs font-bold text-slate-600">30 dias</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-2">
                    Depois apenas <strong>R$ 49,90/mês</strong>. Sem comissão por obra!
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>0% de comissão</strong> sobre seus serviços</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Busca inteligente por GPS e raio em KM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Botão direto para o seu WhatsApp pessoal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fotos de obras concluídas (portfólio)</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${selectedPlan === 'provider'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-100 text-slate-700'
                  }`}
              >
                <span>Selecionar Autônomo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PLANO LOJA REGIONAL */}
            <div
              onClick={() => setSelectedPlan('store_basic')}
              className={`rounded-3xl p-7 border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${selectedPlan === 'store_basic'
                ? 'border-amber-500 shadow-2xl ring-4 ring-amber-500/10'
                : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Loja Regional</h3>
                    <p className="text-[11px] text-slate-500">Divulgação de Depósitos e Lojas</p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 mb-6">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
                    Assinatura de Anúncio
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white">R$ 199,90</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-2">
                    Presença institucional e rotas direto no mapa.
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Banner institucional nas buscas da sua cidade</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Página institucional com rota no Google Maps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Botão direto para o WhatsApp do balcão</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${selectedPlan === 'store_basic'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-100 text-slate-700'
                  }`}
              >
                <span>Selecionar Loja Regional</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PLANO LOJA DESTAQUE */}
            <div
              onClick={() => setSelectedPlan('store_featured')}
              className={`rounded-3xl p-7 border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${selectedPlan === 'store_featured'
                ? 'border-amber-500 shadow-2xl ring-4 ring-amber-500/10'
                : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              {selectedPlan === 'store_featured' && (
                <span className="absolute -top-3 left-6 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Maior Alcance
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Loja Destaque Vip</h3>
                    <p className="text-[11px] text-slate-500">Múltiplas Cidades e Raio até 100km</p>
                  </div>
                </div>

                <div className="bg-amber-500 text-slate-950 rounded-2xl p-4 border border-amber-600 mb-6">
                  <span className="text-[11px] font-black uppercase tracking-wide block">
                    Publicidade de Alta Visibilidade
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black">R$ 299,90</span>
                    <span className="text-xs font-bold text-slate-900">/mês</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-900 block mt-2">
                    Banner de capa rotativo no topo absoluto de toda a região.
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Banner topo fixo em raio de até 100 km</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Selo exclusivo de Empresa Parceira Recomendada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Métricas completas de cliques e interesse do público</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${selectedPlan === 'store_featured'
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-md'
                  : 'bg-slate-100 text-slate-700'
                  }`}
              >
                <span>Selecionar Loja Destaque</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE CADASTRO */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Cadastro Instantâneo
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {selectedPlan === 'provider'
                  ? 'Ativar Minha Conta com 30 Dias Grátis'
                  : 'Cadastrar Loja Anunciante'}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {selectedPlan === 'provider' ? 'Seu Nome Completo' : 'Razão Social / Nome da Loja'} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedPlan === 'provider' ? 'Ex: Carlos Silva' : 'Ex: ConstruVale Materiais'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    WhatsApp para Contatos *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="18997000000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    E-mail para Acesso *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@gmail.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Crie sua Senha de Acesso *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    CEP Principal (Localização GPS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Ex: 19970-000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Especialidade Principal *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Ativando cadastro na rede nacional...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {selectedPlan === 'provider'
                          ? 'Concluir Cadastro & Iniciar 30 Dias Grátis'
                          : 'Concluir Cadastro da Loja'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-2">
                🔒 Seus dados estão protegidos. Plataforma em conformidade com a LGPD.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
