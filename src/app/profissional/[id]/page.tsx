'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  MessageCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';

export default function ProfissionalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { providers, registerClick, addReview } = useApp();

  const providerId = params?.id as string;
  const provider = providers.find((p) => p.id === providerId);

  // Formulário de nova avaliação
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceHired, setServiceHired] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (provider) {
      registerClick(provider.id, 'profile_view');
    }
  }, [provider?.id]);

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Profissional não encontrado</h2>
            <p className="text-xs text-slate-500 mb-6">
              O perfil procurado pode ter sido pausado ou o link está incorreto.
            </p>
            <Link
              href="/explorar"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Busca</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleWhatsApp = () => {
    registerClick(provider.id, 'whatsapp_click');
    const msg = encodeURIComponent(
      `Olá ${provider.fullName}! Encontrei seu perfil no Tá Na Mão e gostaria de solicitar um orçamento para um serviço.`
    );
    window.open(`https://wa.me/55${provider.phoneWhatsapp}?text=${msg}`, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    addReview(provider.id, {
      authorName: authorName.trim(),
      rating,
      serviceHired: serviceHired.trim() || undefined,
      comment: comment.trim(),
    });

    setSubmitted(true);
    setAuthorName('');
    setComment('');
    setServiceHired('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Botão de Retorno */}
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos resultados</span>
            </button>
          </div>

          {/* ============================================================= */}
          {/* CABEÇALHO DO PERFIL */}
          {/* ============================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Avatar e Dados Principais */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-md">
                    {provider.avatarUrl ? (
                      <Image
                        src={provider.avatarUrl}
                        alt={provider.fullName}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-3xl">
                        {provider.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {provider.isVerified && (
                    <div
                      title="Profissional Verificado pelo Tá Na Mão"
                      className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-2 rounded-2xl shadow-lg border-2 border-white"
                    >
                      <ShieldCheck className="w-5 h-5 fill-slate-950 text-amber-500" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {provider.categories.map((c) => (
                      <span
                        key={c.id}
                        className="bg-amber-100 text-amber-900 font-bold text-xs uppercase px-3 py-1 rounded-full border border-amber-200"
                      >
                        {c.name}
                      </span>
                    ))}
                    {provider.isVerified && (
                      <span className="bg-emerald-100 text-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {provider.fullName}
                  </h1>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 flex-wrap">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{provider.ratingAvg.toFixed(1)}</span>
                      <span className="text-slate-400">({provider.reviewsCount} avaliações)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{provider.yearsExperience} anos de experiência</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">Sede em {provider.baseCity} - SP</span>
                    <span>(Atende: {provider.citiesServed.join(', ')})</span>
                  </div>
                </div>
              </div>

              {/* Botão de WhatsApp de Alta Conversão */}
              <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-3 text-base"
                >
                  <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
                  <span>Solicitar Orçamento no WhatsApp</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  ⚡ Resposta direta pelo profissional • Sem taxas
                </span>
              </div>
            </div>

            {/* Biografia Completa */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                Sobre o Profissional
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {provider.bio}
              </p>
            </div>
          </div>

          {/* ============================================================= */}
          {/* GALERIA DE FOTOS DE OBRAS REALIZADAS (PORTFÓLIO) */}
          {/* ============================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Camera className="w-6 h-6 text-amber-500" />
                  Obras e Reformas Realizadas
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Registros fotográficos de serviços concluídos por {provider.fullName}
                </p>
              </div>
            </div>

            {provider.portfolio.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Nenhuma foto cadastrada ainda neste portfólio.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {provider.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ============================================================= */}
          {/* AVALIAÇÕES E DEPOIMENTOS */}
          {/* ============================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                Avaliações de Clientes ({provider.reviewsCount})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Opiniões de quem já contratou e executou obras na região
              </p>
            </div>

            {/* Lista de Avaliações */}
            <div className="space-y-4">
              {provider.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{rev.authorName}</span>
                      {rev.serviceHired && (
                        <span className="text-xs text-slate-500 ml-2">
                          • Contratou: <strong>{rev.serviceHired}</strong>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Formulário para Nova Avaliação */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Já contratou este profissional? Deixe sua avaliação!
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Sua avaliação ajuda outros moradores da região a escolherem com segurança.
              </p>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Obrigado! Sua avaliação foi cadastrada com sucesso e já está visível no perfil.</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Roberto Silva"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Serviço Contratado
                    </label>
                    <input
                      type="text"
                      value={serviceHired}
                      onChange={(e) => setServiceHired(e.target.value)}
                      placeholder="Ex: Reforma do Banheiro"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nota (1 a 5 estrelas)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {rating} estrelas
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Seu Comentário *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte como foi o atendimento, pontualidade e qualidade do serviço..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Publicar Avaliação</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
