-- =====================================================================
-- SCHEMA INICIAL - PLATAFORMA "TÁ NA MÃO"
-- Portal Regional da Construção Civil, Reformas e Lojas de Materiais
-- Cidades: Palmital, Assis, Tarumã e Cândido Mota (SP)
-- =====================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 1. TABELA: profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'provider', 'store', 'admin')) DEFAULT 'provider',
    full_name TEXT NOT NULL,
    email TEXT,
    phone_whatsapp TEXT NOT NULL,
    avatar_url TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'SP',
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 2. TABELA: cities
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'SP',
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- =====================================================================
-- 3. TABELA: categories
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0
);

-- =====================================================================
-- 4. TABELA: provider_profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    years_experience INT NOT NULL DEFAULT 1,
    cities_served TEXT[] NOT NULL DEFAULT '{}',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    subscription_status TEXT NOT NULL CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled')) DEFAULT 'trialing',
    trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
    current_period_end TIMESTAMPTZ,
    plan_price NUMERIC(10,2) NOT NULL DEFAULT 49.90,
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0.00,
    reviews_count INT NOT NULL DEFAULT 0,
    total_views INT NOT NULL DEFAULT 0,
    total_whatsapp_clicks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 5. TABELA: provider_categories
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.provider_categories (
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (provider_id, category_id)
);

-- =====================================================================
-- 6. TABELA: portfolio_items
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 7. TABELA: store_profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.store_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    company_name TEXT NOT NULL,
    cnpj TEXT,
    address TEXT,
    banner_url TEXT,
    cities_targeted TEXT[] NOT NULL DEFAULT '{}',
    subscription_status TEXT NOT NULL CHECK (subscription_status IN ('active', 'past_due', 'canceled')) DEFAULT 'past_due',
    current_period_end TIMESTAMPTZ,
    plan_price NUMERIC(10,2) NOT NULL DEFAULT 249.90,
    total_banner_clicks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 8. TABELA: store_offers
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.store_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.store_profiles(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    original_price NUMERIC(10,2),
    promotional_price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    valid_until DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 9. TABELA: reviews
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_hired TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 10. TABELA: subscriptions_payments
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('autonomo_49_90', 'empresa_249_90')),
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'manual_admin')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 11. TABELA: analytics_events
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_id UUID NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'whatsapp_click', 'banner_click')),
    viewer_city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 12. ÍNDICES DE PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_subscription ON public.provider_profiles(subscription_status, trial_ends_at, current_period_end);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.reviews(provider_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_store_offers_store ON public.store_offers(store_id, is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_target_event ON public.analytics_events(target_id, event_type);

-- =====================================================================
-- 13. FUNÇÃO AUXILIAR DE SEGURANÇA: is_admin()
-- =====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND is_blocked = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 14. VIEW PÚBLICA DE PRESTADORES ATIVOS (Trava Automática)
-- =====================================================================
CREATE OR REPLACE VIEW public.public_active_providers AS
SELECT 
    pp.id AS provider_id,
    pp.user_id,
    p.full_name,
    p.avatar_url,
    p.city AS base_city,
    p.state,
    p.phone_whatsapp,
    pp.bio,
    pp.years_experience,
    pp.cities_served,
    pp.is_verified,
    pp.subscription_status,
    pp.trial_ends_at,
    pp.current_period_end,
    pp.rating_avg,
    pp.reviews_count,
    pp.total_views,
    pp.total_whatsapp_clicks,
    pp.created_at
FROM public.provider_profiles pp
JOIN public.profiles p ON pp.user_id = p.id
WHERE p.is_blocked = false
  AND (
      (pp.subscription_status = 'trialing' AND pp.trial_ends_at > now())
      OR
      (pp.subscription_status = 'active' AND (pp.current_period_end IS NULL OR pp.current_period_end > now()))
  );

-- =====================================================================
-- 15. TRIGGER: Atualização automática de avaliações do prestador
-- =====================================================================
CREATE OR REPLACE FUNCTION public.update_provider_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_provider_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_provider_id := OLD.provider_id;
    ELSE
        v_provider_id := NEW.provider_id;
    END IF;

    UPDATE public.provider_profiles
    SET 
        rating_avg = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM public.reviews
            WHERE provider_id = v_provider_id AND is_approved = true
        ), 0.00),
        reviews_count = COALESCE((
            SELECT COUNT(*)
            FROM public.reviews
            WHERE provider_id = v_provider_id AND is_approved = true
        ), 0)
    WHERE id = v_provider_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_provider_ratings ON public.reviews;
CREATE TRIGGER trg_update_provider_ratings
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_provider_rating_stats();

-- =====================================================================
-- 16. FUNÇÃO RPC: Registro de Eventos e Contabilização
-- =====================================================================
CREATE OR REPLACE FUNCTION public.register_click_event(
    p_target_id UUID,
    p_event_type TEXT,
    p_city TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- 1. Insere o evento no histórico de analytics
    INSERT INTO public.analytics_events (target_id, event_type, viewer_city, created_at)
    VALUES (p_target_id, p_event_type, p_city, now());

    -- 2. Atualiza os contadores correspondentes
    IF p_event_type = 'whatsapp_click' THEN
        UPDATE public.provider_profiles
        SET total_whatsapp_clicks = total_whatsapp_clicks + 1
        WHERE id = p_target_id;
    ELSIF p_event_type = 'profile_view' THEN
        UPDATE public.provider_profiles
        SET total_views = total_views + 1
        WHERE id = p_target_id;
    ELSIF p_event_type = 'banner_click' THEN
        UPDATE public.store_profiles
        SET total_banner_clicks = total_banner_clicks + 1
        WHERE id = p_target_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 17. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Cidades & Categorias: Leitura pública, gravação apenas Admin
CREATE POLICY "Cidades são públicas para leitura" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admin gerencia cidades" ON public.cities FOR ALL USING (public.is_admin());

CREATE POLICY "Categorias são públicas para leitura" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin gerencia categorias" ON public.categories FOR ALL USING (public.is_admin());

-- Profiles: Leitura pública dos não bloqueados, update próprio ou admin
CREATE POLICY "Perfis visíveis para leitura pública" ON public.profiles FOR SELECT USING (is_blocked = false OR public.is_admin());
CREATE POLICY "Usuário edita próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin gerencia todos os perfis" ON public.profiles FOR ALL USING (public.is_admin());

-- Provider Profiles: Leitura pública, update próprio ou admin
CREATE POLICY "Provider profiles visíveis publicamente" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "Provider edita próprio perfil" ON public.provider_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin gerencia todos provider profiles" ON public.provider_profiles FOR ALL USING (public.is_admin());

-- Categorias de Prestadores: Leitura pública, edição pelo próprio prestador ou admin
CREATE POLICY "Provider categories leitura pública" ON public.provider_categories FOR SELECT USING (true);
CREATE POLICY "Provider gerencia suas categorias" ON public.provider_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.provider_profiles pp WHERE pp.id = provider_id AND pp.user_id = auth.uid())
);
CREATE POLICY "Admin gerencia provider categories" ON public.provider_categories FOR ALL USING (public.is_admin());

-- Portfolio: Leitura pública, edição pelo próprio prestador ou admin
CREATE POLICY "Portfolio visível publicamente" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Provider gerencia seu portfolio" ON public.portfolio_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.provider_profiles pp WHERE pp.id = provider_id AND pp.user_id = auth.uid())
);
CREATE POLICY "Admin gerencia portfolio" ON public.portfolio_items FOR ALL USING (public.is_admin());

-- Lojas & Ofertas: Leitura pública das lojas ativas, edição pela própria loja ou admin
CREATE POLICY "Store profiles visíveis publicamente" ON public.store_profiles FOR SELECT USING (subscription_status = 'active' OR public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "Loja edita seu perfil" ON public.store_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin gerencia lojas" ON public.store_profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Ofertas visíveis publicamente" ON public.store_offers FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Loja gerencia suas ofertas" ON public.store_offers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.store_profiles sp WHERE sp.id = store_id AND sp.user_id = auth.uid())
);
CREATE POLICY "Admin gerencia ofertas" ON public.store_offers FOR ALL USING (public.is_admin());

-- Avaliações: Leitura pública das aprovadas, criação por autenticados, admin modera
CREATE POLICY "Avaliações aprovadas são públicas" ON public.reviews FOR SELECT USING (is_approved = true OR public.is_admin());
CREATE POLICY "Usuários autenticados criam avaliações" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin modera avaliações" ON public.reviews FOR ALL USING (public.is_admin());

-- Pagamentos: Usuário vê os seus, Admin vê todos
CREATE POLICY "Usuário vê seus pagamentos" ON public.subscriptions_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário cria pedido de pagamento" ON public.subscriptions_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin gerencia pagamentos" ON public.subscriptions_payments FOR ALL USING (public.is_admin());

-- Analytics: Insert público (via RPC ou direto), leitura pelo admin
CREATE POLICY "Qualquer um insere eventos de analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin visualiza analytics" ON public.analytics_events FOR SELECT USING (public.is_admin());

-- =====================================================================
-- 18. SEED DATA - DADOS INICIAIS DA REGIÃO
-- =====================================================================

-- Cidades Foco
INSERT INTO public.cities (name, state, slug, is_active) VALUES
('Palmital', 'SP', 'palmital', true),
('Assis', 'SP', 'assis', true),
('Tarumã', 'SP', 'taruma', true),
('Cândido Mota', 'SP', 'candido-mota', true)
ON CONFLICT (slug) DO NOTHING;

-- Categorias da Construção Civil
INSERT INTO public.categories (name, slug, icon_name, is_active, display_order) VALUES
('Pedreiro e Alvenaria', 'pedreiro', 'Hammer', true, 1),
('Encanador e Hidráulica', 'encanador', 'Wrench', true, 2),
('Eletricista Residencial e Industrial', 'eletricista', 'Zap', true, 3),
('Pintor e Acabamentos', 'pintor', 'Paintbrush', true, 4),
('Gesseiro e Drywall', 'gesseiro', 'Layers', true, 5),
('Serralheria e Estruturas Metálicas', 'serralheiro', 'Shield', true, 6),
('Engenharia e Arquitetura', 'engenheiro-arquiteto', 'Compass', true, 7),
('Marcenaria e Móveis Planejados', 'marceneiro', 'Box', true, 8),
('Jardinagem e Paisagismo', 'jardinagem', 'Trees', true, 9),
('Materiais de Construção', 'materiais-construcao', 'Building2', true, 10)
ON CONFLICT (slug) DO NOTHING;
