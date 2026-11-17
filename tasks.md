# Plano de Desenvolvimento — Sistema "Tá Na Mão"
> Portal Regional de Serviços da Construção Civil, Reformas e Lojas de Materiais
> Região: Palmital, Assis, Tarumã e Cândido Mota (SP)

---

## Status Geral do Projeto: ✅ 100% Concluído e Validado

- [x] **Etapa 1: Arquitetura Inicial e Setup do Projeto**
  - [x] 1.1 Criar a estrutura Next.js 14+ (App Router) com TypeScript e Tailwind CSS
  - [x] 1.2 Configurar paleta de cores corporativa da Construção Civil (#F59E0B Âmbar, #0F172A Azul Escuro, #16A34A WhatsApp, #F8FAFC Fundo)
  - [x] 1.3 Configurar Lucide Icons e biblioteca de utilitários de componentes
  - [x] 1.4 Configurar cliente do Supabase com fallback automático para modo demonstração

- [x] **Etapa 2: Banco de Dados Supabase (SQL Migration & Seed)**
  - [x] 2.1 Criar `supabase/migrations/001_initial_schema.sql` com as 11 tabelas completas
  - [x] 2.2 Implementar RLS (Row Level Security) e função de segurança `is_admin()`
  - [x] 2.3 Criar a View `public_active_providers` com a trava automática de inadimplência/trial
  - [x] 2.4 Criar Triggers para atualização automática de `rating_avg` e `reviews_count`
  - [x] 2.5 Criar Função RPC `register_click_event` para contabilização de cliques no WhatsApp e views anônimas
  - [x] 2.6 Criar Seed data regional completo (Cidades: Palmital, Assis, Tarumã, Cândido Mota; Categorias da construção; Prestadores autônomos; Lojas parceiras; Avaliações e Usuário Admin)

- [x] **Etapa 3: Camada de Dados, Tipos TypeScript e Modo Demonstração (Mock Store)**
  - [x] 3.1 Criar definições de tipos TypeScript unificados (`src/types/index.ts`)
  - [x] 3.2 Criar repositório com dados de demonstração completos (`src/lib/demo-data.ts`)
  - [x] 3.3 Implementar camada de serviço e estado reativo persistente (`src/context/AppContext.tsx`)
  - [x] 3.4 Implementar barra de demonstração/seletor de perfil rápido (`src/components/DemoToolbar.tsx`)

- [x] **Etapa 4: Área Pública e Experiência do Usuário (Frontend)**
  - [x] 4.1 Navbar moderna com Logo "Tá Na Mão", Seletor de Cidade persistente, Busca e Botão "Anuncie seu Serviço (30 Dias Grátis)"
  - [x] 4.2 Rodapé institucional completo com cidades atendidas, categorias e suporte
  - [x] 4.3 Página Inicial (`/`): Hero Section com busca rápida, grade de categorias, banners de lojas, vitrine em destaque e "Como Funciona"
  - [x] 4.4 Página de Vendas e Captura (`/anuncie`): comparativo Autônomo (R$ 49,90) vs. Loja (R$ 249,90) e ativação imediata dos 30 dias grátis
  - [x] 4.5 Página de Busca e Catálogo (`/explorar`): filtros combináveis (Cidade, Categoria, Ordenação e Palavra-chave)
  - [x] 4.6 Página de Perfil do Profissional (`/profissional/[id]`): bio, anos de experiência, galeria de obras, avaliações e botão de WhatsApp com rastreamento
  - [x] 4.7 Página de Vitrine da Loja de Materiais (`/loja/[id]`): capa, endereço, WhatsApp do balcão e produtos em oferta com preço riscado

- [x] **Etapa 5: Autenticação & Painel do Assinante (`/painel`)**
  - [x] 5.1 Telas de Login rápido para teste e acesso ao painel
  - [x] 5.2 Header do Painel com alerta visual de status da assinatura (contador de dias do Trial)
  - [x] 5.3 Métricas de Retorno (Cards de Visualizações do Perfil e Cliques no WhatsApp gerados)
  - [x] 5.4 Formulário completo de edição de perfil
  - [x] 5.5 Gestão de Portfólio de Obras e Gestão de Ofertas da Loja
  - [x] 5.6 Módulo "Minha Assinatura / Pagamento": Checkout com Pix Copia e Cola, QR Code e simulação funcional com confete

- [x] **Etapa 6: Painel do Administrador Mestre — Backoffice (`/admin`)**
  - [x] 6.1 Layout exclusivo de Admin com sidebar e proteção de acesso por `role = 'admin'`
  - [x] 6.2 Dashboard Executivo com KPIs (MRR, Prestadores Ativos, Trial, Inadimplentes, Lojas, Cliques no WhatsApp)
  - [x] 6.3 Gestão de Profissionais (`/admin/profissionais`): busca, botão "+30 Dias Manualmente", toggle de Selo de Verificado, bloqueio e edição
  - [x] 6.4 Gestão de Lojas e Banners (`/admin/lojas`): plano de R$ 249,90, ofertas e métricas de cliques por banner
  - [x] 6.5 Controle Financeiro (`/admin/financeiro`): histórico de cobranças e botão de confirmação manual de Pix
  - [x] 6.6 Gestão de Categorias e Cidades (`/admin/configuracoes`): adicionar/editar profissões e cidades atendidas
  - [x] 6.7 Moderação de Avaliações (`/admin/avaliacoes`): exclusão e aprovação de depoimentos

- [x] **Etapa 7: Validação, Build, Testes e Sincronização**
  - [x] 7.1 Executar validação de compilação Next.js (`npm run build`) -> Concluído com 0 erros
  - [x] 7.2 Sincronizar todos os códigos com o repositório GitHub (`git add .`, `commit`, `push origin main`)
