'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, Plus, Tag, Eye, EyeOff, DollarSign, Save } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function AdminConfiguracoesPage() {
  const { categories } = useApp();

  const [catList, setCatList] = useState(categories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Hammer');

  // Valores dos Planos Nacionais SaaS
  const [planProvider, setPlanProvider] = useState('49.90');
  const [planStoreBasic, setPlanStoreBasic] = useState('199.90');
  const [planStoreFeatured, setPlanStoreFeatured] = useState('299.90');
  const [plansSaved, setPlansSaved] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/\s+/g, '-');
    const newCat = {
      id: Date.now(),
      name: newCatName.trim(),
      slug,
      iconName: newCatIcon,
      isActive: true,
      displayOrder: catList.length + 1,
    };
    setCatList([...catList, newCat]);
    setNewCatName('');
    alert(`Categoria "${newCat.name}" criada com sucesso!`);
  };

  const toggleCatActive = (id: number) => {
    setCatList(catList.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const handleSavePlans = (e: React.FormEvent) => {
    e.preventDefault();
    setPlansSaved(true);
    setTimeout(() => setPlansSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-amber-500" />
          Configurações: Categorias & Planos SaaS
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Adicione novas profissões da construção civil e configure as mensalidades nacionais da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ============================================================= */}
        {/* COLUNA 1: CATEGORIAS */}
        {/* ============================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              Categorias da Construção Civil ({catList.length})
            </h3>
          </div>

          {/* Form Adicionar Categoria */}
          <form onSubmit={handleAddCategory} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase block">
              Criar Nova Especialidade:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ex: Energia Solar, Terraplanagem"
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-semibold"
              >
                <option value="Hammer">Ícone: Martelo (Hammer)</option>
                <option value="Zap">Ícone: Raio / Elétrica (Zap)</option>
                <option value="Wrench">Ícone: Chave / Hidráulica (Wrench)</option>
                <option value="Paintbrush">Ícone: Pincel (Paintbrush)</option>
                <option value="Compass">Ícone: Engenharia (Compass)</option>
                <option value="Building2">Ícone: Loja / Prédio (Building2)</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Adicionar Categoria</span>
            </button>
          </form>

          {/* Lista de Categorias */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {catList.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center text-slate-700">
                    <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-800">{cat.name}</span>
                </div>

                <button
                  onClick={() => toggleCatActive(cat.id)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                    cat.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{cat.isActive ? 'Ativa' : 'Oculta'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================= */}
        {/* COLUNA 2: VALORES DOS PLANOS SAAS */}
        {/* ============================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Planos & Mensalidades Nacionais
            </h3>
          </div>

          {plansSaved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
              ✓ Preços dos planos atualizados com sucesso no gateway!
            </div>
          )}

          <form onSubmit={handleSavePlans} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Plano Prestador Autônomo (Mensalidade)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={planProvider}
                  onChange={(e) => setPlanProvider(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                30 dias grátis na criação da conta; após isso cobra este valor.
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Plano Loja Parceira - Divulgação Regional
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={planStoreBasic}
                  onChange={(e) => setPlanStoreBasic(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Banners e página institucional com raio até 50km.
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Plano Loja Parceira - Destaque Especial VIP
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={planStoreFeatured}
                  onChange={(e) => setPlanStoreFeatured(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Banner no topo fixo em raio de até 100km.
              </span>
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-black px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Salvar Novos Valores</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
