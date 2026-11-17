# Tá na Mão

Plataforma de busca de profissionais e lojas de construção, reforma e manutenção.

## Executar o site

1. Instale as dependências com `npm ci`.
2. Em um banco Supabase novo, execute `supabase/migrations/001_complete_national_schema.sql` no SQL Editor. Em um banco com esse esquema nacional já aplicado, prossiga para a etapa seguinte.
3. Execute `supabase/migrations/002_authenticated_product.sql`.
4. Copie `.env.example` para `.env.local` e preencha a URL e a chave pública do Supabase. Defina `NEXT_PUBLIC_SITE_URL` com a URL do site.
5. Em **Authentication → URL Configuration** no Supabase, configure a URL do site e permita o redirecionamento para `/auth/callback` no mesmo domínio. Use o provedor de e-mail e senha.
6. Rode `npm run dev` e acesse `http://localhost:3000`.

Clientes são direcionados à busca. Prestadores e lojas vão ao painel de anúncios. O papel de administrador é atribuído diretamente pelo responsável pelo banco a uma conta já cadastrada.

O checkout e o webhook respondem com indisponibilidade até a integração com o gateway de pagamentos.
