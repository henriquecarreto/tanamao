'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Building2,
  HardHat,
  ArrowRight,
  Gift,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AnunciePage() {
  const router = useRouter();
  const { cities, categories, switchRole } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'provider' | 'store'>('provider');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Palmital');
  const [category, setCategory] = useState('pedreiro');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    setTimeout(() => {
      // Ativa o perfil correspondente e vai pro painel
      switchRole(selectedPlan);
      router.push('/painel?trial=activated');
    }, 1200);
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
              <span>Campanha de Lançamento Regional — 30 Dias Grátis</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Receba clientes prontos para fechar obra{' '}
              <span className="text-amber-400">direto no seu WhatsApp.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
              O Tá Na Mão é o portal regional que mais cresce em Palmital, Assis, Tarumã e Cândido Mota. Cadastre-se agora, experimente 30 dias de graça e comprove os resultados!
            </p>
          </div>
        </section>

        {/* COMPARATIVO DE PLANOS */}
        <section className="py-14 -mt-10 px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PLANO AUTÔNOMO */}
            <div
              onClick={() => setSelectedPlan('provider')}
              className={`rounded-3xl p-8 border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                selectedPlan === 'provider'
                  ? 'border-amber-500 shadow-2xl ring-4 ring-amber-500/10'
                  : 'border-slate-200 hover:border-slate-300 shadow-md'
              }`}
            >
              {selectedPlan === 'provider' && (
                <span className="absolute -top-3 left-8 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Mais Escolhido
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Plano Profissional Autônomo</h3>
                    <p className="text-xs text-slate-500">Pedreiro, Eletricista, Pintor, Encanador, etc.</p>
                  </div>
                </div>

                {/* Preço com Destaque de 30 Dias Grátis */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block">
                    🎁 Primeiro Mês
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">GRÁTIS</span>
                    <span className="text-xs font-bold text-slate-600">por 30 dias</span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-2">
                    Depois apenas <strong>R$ 49,90/mês</strong>. Cancele quando quiser.
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Zero comissão</strong>: 100% do valor da sua obra é seu</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Botão direto para o seu WhatsApp pessoal</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Galeria ilimitada de fotos de obras e reformas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Selo de Profissional Verificado pelo portal</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Métricas de quantos clientes visitaram seu perfil</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  selectedPlan === 'provider'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Selecionar Plano Autônomo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PLANO LOJA DE MATERIAIS */}
            <div
              onClick={() => setSelectedPlan('store')}
              className={`rounded-3xl p-8 border-2 transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                selectedPlan === 'store'
                  ? 'border-amber-500 shadow-2xl ring-4 ring-amber-500/10'
                  : 'border-slate-200 hover:border-slate-300 shadow-md'
              }`}
            >
              {selectedPlan === 'store' && (
                <span className="absolute -top-3 left-8 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Plano Corporativo
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Plano Loja de Materiais (B2B)</h3>
                    <p className="text-xs text-slate-500">Lojas, Madereiras, Elétricas e Caçambas</p>
                  </div>
                </div>

                {/* Preço Loja */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 mb-6">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                    Publicidade de Alto Alcance
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">R$ 249,90</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-2">
                    Divulgação garantida para quem está reformando na região.
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Banner promocional em destaque no topo da cidade</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Página exclusiva da loja com catálogo de ofertas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Botão direto para o WhatsApp do balcão de vendas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Relatório de cliques e interesse do público</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  selectedPlan === 'store'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Selecionar Plano Loja</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE CADASTRO RÁPIDO */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Passo Rápido
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Criar Cadastro e Ativar{' '}
                {selectedPlan === 'provider' ? '30 Dias Grátis' : 'Plano Loja'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Leva menos de 1 minuto e seu perfil já entra no ar hoje mesmo!
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {selectedPlan === 'provider' ? 'Seu Nome Completo' : 'Nome Fantasia da Loja'} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedPlan === 'provider' ? 'Ex: Carlos Silva' : 'Ex: Depósito Alvorada'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    WhatsApp para Contato *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="18997000000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    E-mail (para login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@gmail.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cidade Sede *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} - SP
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Especialidade Principal *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-medium"
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
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl text-base shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Ativando sua conta gratuita...</span>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Concluir Cadastro & Ativar 30 Dias Grátis</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-2">
                🔒 Seus dados estão protegidos. Ao clicar você concorda com os Termos de Uso do Tá Na Mão.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
