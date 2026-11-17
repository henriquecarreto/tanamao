# Plano de Refatoração e Consolidação — Plataforma Nacional "Tá Na Mão"
> SaaS Automatizado em Escala Nacional (Brasil) com Busca Geolocalizada (GPS / CEP BrasilAPI / IBGE)
> Modelo de Cascata: Rua/Bairro (<= 2 km) -> Cidade (2-15 km) -> Região (> 15 km)

---

## Status Geral: ✅ 100% Concluído e Validado (0 Erros)

- [x] **Etapa 1: Reestruturação do Banco de Dados e PostGIS**
  - [x] 1.1 Criar migração SQL definitiva `supabase/migrations/001_complete_national_schema.sql`
  - [x] 1.2 Habilitar extensão PostGIS e triggers de sincronização de ponto espacial (`geography(Point, 4326)`)
  - [x] 1.3 Criar RPC `search_providers_cascade` com ordenação por proximity_tier (1: Bairro <= 2km, 2: Cidade <= 15km, 3: Região)
  - [x] 1.4 Remover definitivamente tabelas e colunas de produtos/ofertas (`store_offers`), consolidando lojas como anunciantes institucionais
  - [x] 1.5 Estruturar tabela de pagamentos com rastreamento de Webhook e gateway automático

- [x] **Etapa 2: Serviço de Geolocalização Nacional (GPS, BrasilAPI v2, IBGE)**
  - [x] 2.1 Criar `src/lib/geolocation.ts` com cálculo Haversine de distância em km
  - [x] 2.2 Integrar `BrasilAPI v2` (`/api/cep/v2/{cep}`) para captura automática de Rua, Bairro, Cidade, UF e Lat/Lng
  - [x] 2.3 Integrar API do IBGE (`/api/v1/localidades/estados` e `/municipios`) para seleção nacional completa
  - [x] 2.4 Integrar `navigator.geolocation` com Reverse Geocoding automático
  - [x] 2.5 Criar classificador em cascata: Tier 1 (Hiperlocal <= 2km), Tier 2 (Municipal <= 15km), Tier 3 (Regional dentro do raio do prestador)

- [x] **Etapa 3: Tipos TypeScript e Dados Demonstrativos Nacionais**
  - [x] 3.1 Atualizar `src/types/index.ts` removendo `StoreOffer` e adicionando coordenadas, CEP, bairros, raio em km e tiers
  - [x] 3.2 Atualizar `src/lib/demo-data.ts` com prestadores em diferentes ruas, bairros, cidades e estados com coordenadas reais para validação visual dos 3 níveis de cascata
  - [x] 3.3 Atualizar lojas parceiras no modelo 100% institucional (sem preços/produtos)

- [x] **Etapa 4: Rotas de API e Webhook Automatizado (Zero Admin Manual)**
  - [x] 4.1 Criar `src/app/api/checkout/route.ts` para geração de cobrança automatizada Pix (QR Code dinâmico) e Cartão
  - [x] 4.2 Criar `src/app/api/webhooks/payment/route.ts` para processamento do webhook do gateway e liberação imediata da assinatura
  - [x] 4.3 Implementar listener em tempo real no cliente com desbloqueio instantâneo da tela

- [x] **Etapa 5: Componentes e Interfaces Públicas Geolocalizadas**
  - [x] 5.1 Criar `src/components/LocationModal.tsx` integrado no Header para troca instantânea de localização (GPS, CEP ou Estado/Cidade)
  - [x] 5.2 Atualizar `Navbar.tsx` exibindo a localização ativa do cliente (Ex: "📍 Centro, Palmital - SP" ou "📍 Jardins, São Paulo - SP")
  - [x] 5.3 Atualizar `ProviderCard.tsx` com as badges obrigatórias de proximidade (*"No seu bairro • a X,X km"*, *"Na sua cidade • a X,X km"*, *"Atende sua região • a XX km"*)
  - [x] 5.4 Refatorar `src/app/page.tsx` com busca por GPS/CEP e exibição em cascata dos 3 níveis
  - [x] 5.5 Refatorar `src/app/explorar/page.tsx` com filtros de raio em KM (5 km, 15 km, 50 km, etc.) e localização
  - [x] 5.6 Refatorar Perfil do Prestador (`/profissional/[id]`) exibindo distância exata até o visitante e raio de atendimento
  - [x] 5.7 Refatorar Página da Loja (`/loja/[id]`) como institucional (rotas no Waze/Google Maps, sem produtos)
  - [x] 5.8 Atualizar `/anuncie` com planos para Lojas (R$ 199,90 e R$ 299,90) e 30 dias grátis para autônomos

- [x] **Etapa 6: Painel do Prestador/Loja (`/painel`) e Painel Admin SaaS (`/admin`)**
  - [x] 6.1 No `/painel`, implementar busca de CEP via BrasilAPI v2 que autopreenche Rua, Bairro, Cidade, UF e coordenadas
  - [x] 6.2 No `/painel`, implementar Slider de Raio de Atendimento em KM (`service_radius_km`)
  - [x] 6.3 No `/painel`, implementar Checkout Automatizado com simulação de Webhook e liberação em tempo real na tela
  - [x] 6.4 No `/admin`, remover qualquer aprovação manual de Pix; implementar Auditoria de Webhooks e Transações Gateway em `/admin/financeiro`
  - [x] 6.5 Atualizar Dashboard `/admin` com KPIs nacionais (MRR, conversão, leads, inadimplentes)

- [x] **Etapa 7: Validação de Compilação, Build e Sincronização GitHub**
  - [x] 7.1 Executar `npm run build` garantindo zero erros de compilação e tipagem estrita
  - [x] 7.2 Testar rotas e fluxos
  - [x] 7.3 Commitar e subir tudo para o GitHub

- [x] **Etapa 8: Alinhamento com Especificação Oficial (README)**
  - [x] 8.1 Atualizar `README.md` com instruções canônicas de execução e configuração do Supabase
  - [x] 8.2 Criar migração `supabase/migrations/002_authenticated_product.sql` (trigger `handle_new_user`, RLS, buckets Storage, trava de perfil admin)
  - [x] 8.3 Criar rota `src/app/auth/callback/route.ts` para tratamento de confirmação de e-mail e redirecionamento por perfil
  - [x] 8.4 Validar `.env.example` com `NEXT_PUBLIC_SITE_URL` e parâmetros do Supabase
  - [x] 8.5 Integrar Supabase Auth no `/login` e `/anuncie` (Clientes -> busca /explorar, Prestadores/Lojas -> painel /painel, Admin atribuído exclusivamente no banco)
  - [x] 8.6 Adequar `/api/checkout` e `/api/webhooks/payment` para responder com HTTP 503 (indisponibilidade) até integração oficial com o gateway
