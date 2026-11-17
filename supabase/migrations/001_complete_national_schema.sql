-- =====================================================================
-- SCHEMA NACIONAL CONSOLIDADO - PLATAFORMA "TÁ NA MÃO"
-- SaaS Automatizado em Escala Nacional com Geolocalização PostGIS
-- =====================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================================
-- 1. TABELA: profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'provider', 'store', 'admin')),
    full_name TEXT NOT NULL,
    email TEXT,
    phone_whatsapp TEXT NOT NULL,
    avatar_url TEXT,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 2. TABELA: categories
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
-- 3. TABELA: provider_profiles
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    years_experience INT NOT NULL DEFAULT 1,
    cep TEXT NOT NULL,
    street TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state CHAR(2) NOT NULL,
    ibge_code TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326),
    service_radius_km INT NOT NULL DEFAULT 35,
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
-- 4. TABELA: provider_categories (N:N)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.provider_categories (
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (provider_id, category_id)
);

-- =====================================================================
-- 5. TABELA: portfolio_items
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
-- 6. TABELA: store_profiles (Divulgação Institucional por Assinatura)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.store_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    company_name TEXT NOT NULL,
    cnpj TEXT,
    description TEXT,
    cep TEXT NOT NULL,
    street TEXT,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state CHAR(2) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326),
    coverage_radius_km INT NOT NULL DEFAULT 50,
    banner_url TEXT,
    plan_tier TEXT NOT NULL CHECK (plan_tier IN ('basic_199_90', 'featured_299_90')) DEFAULT 'basic_199_90',
    plan_price NUMERIC(10,2) NOT NULL DEFAULT 199.90,
    subscription_status TEXT NOT NULL CHECK (subscription_status IN ('active', 'past_due', 'canceled')) DEFAULT 'past_due',
    current_period_end TIMESTAMPTZ,
    total_banner_clicks INT NOT NULL DEFAULT 0,
    total_whatsapp_clicks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 7. TABELA: reviews
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
-- 8. TABELA: subscriptions_payments (Automação Gateway / Webhook)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('provider_49_90', 'store_basic_199_90', 'store_featured_299_90')),
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    gateway_transaction_id TEXT UNIQUE,
    pix_qr_code_base64 TEXT,
    pix_copy_paste TEXT,
    webhook_received_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 9. TABELA: analytics_events
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_id UUID NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'whatsapp_click', 'banner_click')),
    viewer_city TEXT,
    viewer_state CHAR(2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 10. ÍNDICES ESPACIAIS E DE PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_provider_profiles_location ON public.provider_profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_store_profiles_location ON public.store_profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_city_state ON public.provider_profiles(state, city);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_sub ON public.provider_profiles(subscription_status, trial_ends_at, current_period_end);
CREATE INDEX IF NOT EXISTS idx_store_profiles_sub ON public.store_profiles(subscription_status, current_period_end);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_tx ON public.subscriptions_payments(gateway_transaction_id);

-- =====================================================================
-- 11. TRIGGERS: SINCRONIZAÇÃO AUTOMÁTICA DE GEOGRAPHY (POSTGIS)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.update_location_point()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_provider_location ON public.provider_profiles;
CREATE TRIGGER trg_provider_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.provider_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_location_point();

DROP TRIGGER IF EXISTS trg_store_location ON public.store_profiles;
CREATE TRIGGER trg_store_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.store_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_location_point();

-- Trigger de estatísticas de avaliações
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

DROP TRIGGER IF EXISTS trg_update_ratings ON public.reviews;
CREATE TRIGGER trg_update_ratings
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_provider_rating_stats();

-- =====================================================================
-- 12. FUNÇÃO RPC: BUSCA EM CASCATA COM POSTGIS
-- =====================================================================
CREATE OR REPLACE FUNCTION public.search_providers_cascade(
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_neighborhood TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_category_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
    provider_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    phone_whatsapp TEXT,
    bio TEXT,
    years_experience INT,
    street TEXT,
    neighborhood TEXT,
    city TEXT,
    state CHAR(2),
    is_verified BOOLEAN,
    rating_avg NUMERIC(3,2),
    reviews_count INT,
    distance_km DOUBLE PRECISION,
    proximity_tier INT,
    service_radius_km INT
) AS $$
DECLARE
    client_point GEOGRAPHY;
BEGIN
    client_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;

    RETURN QUERY
    SELECT 
        pp.id AS provider_id,
        p.full_name,
        p.avatar_url,
        p.phone_whatsapp,
        pp.bio,
        pp.years_experience,
        pp.street,
        pp.neighborhood,
        pp.city,
        pp.state,
        pp.is_verified,
        pp.rating_avg,
        pp.reviews_count,
        ROUND((ST_Distance(pp.location, client_point) / 1000.0)::numeric, 1)::DOUBLE PRECISION AS distance_km,
        CASE
            -- Tier 1: Mesma Rua/Bairro ou até 2km de distância
            WHEN (p_neighborhood IS NOT NULL AND LOWER(pp.neighborhood) = LOWER(p_neighborhood)) 
                 OR (ST_Distance(pp.location, client_point) <= 2000) THEN 1
            -- Tier 2: Mesma Cidade ou até 15km de distância
            WHEN (p_city IS NOT NULL AND LOWER(pp.city) = LOWER(p_city)) 
                 OR (ST_Distance(pp.location, client_point) <= 15000) THEN 2
            -- Tier 3: Região dentro do raio de atendimento do prestador
            WHEN ST_Distance(pp.location, client_point) <= (pp.service_radius_km * 1000) THEN 3
            ELSE 4
        END AS proximity_tier,
        pp.service_radius_km
    FROM public.provider_profiles pp
    JOIN public.profiles p ON pp.user_id = p.id
    WHERE p.is_blocked = false
      AND (
          (pp.subscription_status = 'trialing' AND pp.trial_ends_at > now())
          OR
          (pp.subscription_status = 'active' AND (pp.current_period_end IS NULL OR pp.current_period_end > now()))
      )
      -- Filtro opcional por categoria
      AND (
          p_category_slug IS NULL OR EXISTS (
              SELECT 1 FROM public.provider_categories pc
              JOIN public.categories c ON pc.category_id = c.id
              WHERE pc.provider_id = pp.id AND c.slug = p_category_slug
          )
      )
      -- Exclui apenas quem estiver totalmente fora do raio regional
      AND ST_Distance(pp.location, client_point) <= (GREATEST(pp.service_radius_km, 35) * 1000)
    ORDER BY 
        proximity_tier ASC,
        distance_km ASC,
        pp.is_verified DESC,
        pp.rating_avg DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
-- 14. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis visíveis publicamente" ON public.profiles FOR SELECT USING (is_blocked = false OR public.is_admin());
CREATE POLICY "Usuário edita próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin gerencia profiles" ON public.profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Categorias leitura pública" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin gerencia categorias" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Provider profiles visíveis publicamente" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "Provider edita próprio perfil" ON public.provider_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin gerencia provider profiles" ON public.provider_profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Store profiles leitura pública das ativas" ON public.store_profiles FOR SELECT USING (subscription_status = 'active' OR public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "Loja edita próprio perfil" ON public.store_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin gerencia store profiles" ON public.store_profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Reviews aprovadas leitura pública" ON public.reviews FOR SELECT USING (is_approved = true OR public.is_admin());
CREATE POLICY "Usuários inserem reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin modera reviews" ON public.reviews FOR ALL USING (public.is_admin());

CREATE POLICY "Usuário vê próprios pagamentos" ON public.subscriptions_payments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Sistema insere pagamentos" ON public.subscriptions_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin gerencia pagamentos" ON public.subscriptions_payments FOR ALL USING (public.is_admin());

CREATE POLICY "Eventos analytics insert público" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin vê analytics" ON public.analytics_events FOR SELECT USING (public.is_admin());
