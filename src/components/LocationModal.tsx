'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchIbgeStates, fetchIbgeCitiesByState } from '@/lib/geolocation';
import {
  MapPin,
  Crosshair,
  Search,
  Building,
  Check,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { clientLocation, detectGpsLocation, setCepLocation, setManualLocation } = useApp();

  const [activeTab, setActiveTab] = useState<'gps' | 'cep' | 'ibge'>('gps');
  const [cepInput, setCepInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Estados IBGE
  const [states, setStates] = useState<Array<{ id: number; sigla: string; nome: string }>>([]);
  const [selectedState, setSelectedState] = useState(clientLocation.state || 'SP');
  const [cities, setCities] = useState<Array<{ id: number; nome: string }>>([]);
  const [selectedCity, setSelectedCity] = useState(clientLocation.city || 'Palmital');
  const [neighborhoodInput, setNeighborhoodInput] = useState(clientLocation.neighborhood || '');

  useEffect(() => {
    if (isOpen) {
      fetchIbgeStates().then((sts) => {
        setStates(sts);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedState) {
      fetchIbgeCitiesByState(selectedState).then((cts) => {
        setCities(cts);
        if (cts.length > 0 && !cts.some((c) => c.nome.toLowerCase() === selectedCity.toLowerCase())) {
          setSelectedCity(cts[0].nome);
        }
      });
    }
  }, [selectedState]);

  if (!isOpen) return null;

  const handleGps = async () => {
    setLoading(true);
    setFeedback(null);
    const success = await detectGpsLocation();
    setLoading(false);
    if (success) {
      setFeedback('Localização GPS capturada com sucesso!');
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback('Não foi possível obter o GPS. Tente por CEP ou selecione sua cidade.');
    }
  };

  const handleCepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const success = await setCepLocation(cepInput);
    setLoading(false);
    if (success) {
      setFeedback('CEP localizado na BrasilAPI com sucesso!');
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1000);
    } else {
      setFeedback('CEP não encontrado. Verifique os 8 dígitos e tente novamente.');
    }
  };

  const handleIbgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualLocation(selectedCity, selectedState, neighborhoodInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <MapPin className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Onde você precisa de serviço?
              </h3>
              <p className="text-[11px] text-slate-500">
                Encontre profissionais em qualquer bairro ou município do Brasil
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Localização Atual */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Sua Localização Definida:
            </span>
            <span className="font-extrabold text-slate-900">
              {clientLocation.neighborhood ? `${clientLocation.neighborhood}, ` : ''}
              {clientLocation.city} - {clientLocation.state}
            </span>
            {clientLocation.cep && (
              <span className="text-[10px] text-slate-500 block">CEP: {clientLocation.cep}</span>
            )}
          </div>
          <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
            Ativa
          </span>
        </div>

        {/* Abas de Seleção */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('gps')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'gps'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-500" />
            <span>Usar GPS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cep')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'cep'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Por CEP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ibge')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ibge'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cidade / UF</span>
          </button>
        </div>

        {feedback && (
          <div className="bg-slate-900 text-amber-400 p-3 rounded-xl text-xs font-semibold text-center animate-fade-in">
            {feedback}
          </div>
        )}

        {/* CONTEÚDO TAB 1: GPS AUTOMÁTICO */}
        {activeTab === 'gps' && (
          <div className="space-y-4 text-center py-2">
            <p className="text-xs text-slate-600">
              O GPS captura sua latitude e longitude exatas e identifica sua rua e bairro automaticamente para exibir prestadores a poucos metros de você.
            </p>
            <button
              onClick={handleGps}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3.5 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Obtendo coordenadas do GPS...</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-4 h-4" />
                  <span>Detectar Minha Localização Atual via GPS</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* CONTEÚDO TAB 2: POR CEP (BRASILAPI v2) */}
        {activeTab === 'cep' && (
          <form onSubmit={handleCepSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Digite seu CEP (8 dígitos):
              </label>
              <input
                type="text"
                required
                maxLength={9}
                value={cepInput}
                onChange={(e) => setCepInput(e.target.value)}
                placeholder="Ex: 19970-000 ou 01310-100"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              ⚡ Integrado à BrasilAPI v2: localiza Rua, Bairro, Cidade, Estado e Coordenadas automaticamente.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Buscar Localização por CEP</span>
            </button>
          </form>
        )}

        {/* CONTEÚDO TAB 3: POR ESTADO E MUNICÍPIO (IBGE) */}
        {activeTab === 'ibge' && (
          <form onSubmit={handleIbgeSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Estado (UF):
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {states.map((st) => (
                    <option key={st.id} value={st.sigla}>
                      {st.sigla} - {st.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Município:
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  {cities.map((ct) => (
                    <option key={ct.id} value={ct.nome}>
                      {ct.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bairro (Opcional):
              </label>
              <input
                type="text"
                value={neighborhoodInput}
                onChange={(e) => setNeighborhoodInput(e.target.value)}
                placeholder="Ex: Centro, Vila Xavier, Jardins"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>Confirmar Localização</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
