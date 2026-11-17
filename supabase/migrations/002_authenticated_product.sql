-- =====================================================================
-- MIGRAÇÃO 002: PRODUTO AUTENTICADO (SUPABASE AUTH & REGRAS DE ACESSO)
-- Plataforma Nacional "Tá Na Mão"
-- =====================================================================

-- 1. FUNÇÃO AUTOMÁTICA DE SINCRONIZAÇÃO DE USUÁRIOS (AUTH -> PUBLIC.PROFILES)
-- Garante que todo usuário criado no Supabase Auth receba seu perfil automaticamente.
-- IMPORTANTE: O papel 'admin' NUNCA é atribuído pelo cadastro público.
-- Apenas 'customer', 'provider' ou 'store' são aceitos nos metadados.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT;
    v_full_name TEXT;
    v_phone_whatsapp TEXT;
    v_city TEXT;
    v_state CHAR(2);
    v_neighborhood TEXT;
    v_cep TEXT;
    v_lat DOUBLE PRECISION;
    v_lng DOUBLE PRECISION;
BEGIN
    -- Validação estrita do papel do usuário
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    IF v_role NOT IN ('customer', 'provider', 'store') THEN
        v_role := 'customer';
    END IF;

    -- Extração de dados cadastrais
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
    );
    v_phone_whatsapp := COALESCE(NEW.raw_user_meta_data->>'phone_whatsapp', '');
    v_city := COALESCE(NEW.raw_user_meta_data->>'city', 'São Paulo');
    v_state := COALESCE(NEW.raw_user_meta_data->>'state', 'SP');
    v_neighborhood := COALESCE(NEW.raw_user_meta_data->>'neighborhood', 'Centro');
    v_cep := COALESCE(NEW.raw_user_meta_data->>'cep', '01001-000');
    v_lat := COALESCE((NEW.raw_user_meta_data->>'latitude')::DOUBLE PRECISION, -23.55052);
    v_lng := COALESCE((NEW.raw_user_meta_data->>'longitude')::DOUBLE PRECISION, -46.633308);

    -- Insere ou atualiza o perfil em public.profiles
    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        email,
        phone_whatsapp,
        avatar_url,
        is_blocked,
        created_at
    ) VALUES (
        NEW.id,
        v_role,
        v_full_name,
        NEW.email,
        v_phone_whatsapp,
        NEW.raw_user_meta_data->>'avatar_url',
        false,
        now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone_whatsapp = COALESCE(NULLIF(EXCLUDED.phone_whatsapp, ''), public.profiles.phone_whatsapp);

    -- Se o papel for Prestador ('provider'), inicializa automaticamente o perfil com 30 DIAS GRÁTIS
    IF v_role = 'provider' THEN
        INSERT INTO public.provider_profiles (
            user_id,
            bio,
            years_experience,
            cep,
            street,
            neighborhood,
            city,
            state,
            latitude,
            longitude,
            service_radius_km,
            is_verified,
            subscription_status,
            trial_ends_at,
            plan_price,
            created_at
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'bio', 'Prestador de serviços na plataforma Tá Na Mão.'),
            COALESCE((NEW.raw_user_meta_data->>'years_experience')::INT, 1),
            v_cep,
            COALESCE(NEW.raw_user_meta_data->>'street', 'Rua Principal'),
            v_neighborhood,
            v_city,
            v_state,
            v_lat,
            v_lng,
            COALESCE((NEW.raw_user_meta_data->>'service_radius_km')::INT, 35),
            false,
            'trialing',
            now() + interval '30 days',
            49.90,
            now()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Se o papel for Loja ('store'), inicializa o perfil institucional da loja
    IF v_role = 'store' THEN
        INSERT INTO public.store_profiles (
            user_id,
            company_name,
            cnpj,
            description,
            cep,
            street,
            neighborhood,
            city,
            state,
            latitude,
            longitude,
            coverage_radius_km,
            banner_url,
            plan_tier,
            plan_price,
            subscription_status,
            created_at
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'company_name', v_full_name),
            NEW.raw_user_meta_data->>'cnpj',
            COALESCE(NEW.raw_user_meta_data->>'description', 'Loja de materiais de construção parceira.'),
            v_cep,
            COALESCE(NEW.raw_user_meta_data->>'street', 'Avenida Comercial'),
            v_neighborhood,
            v_city,
            v_state,
            v_lat,
            v_lng,
            50,
            NEW.raw_user_meta_data->>'banner_url',
            'basic_199_90',
            199.90,
            'past_due',
            now()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparo do trigger na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 2. POLÍTICAS ADICIONAIS DE RLS PARA USUÁRIOS AUTENTICADOS
-- =====================================================================

-- Impede que usuários comuns alterem o próprio campo 'role' (apenas admin ou trigger)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.role <> NEW.role AND NOT public.is_admin()) THEN
        RAISE EXCEPTION 'Apenas administradores podem alterar o papel de uma conta.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Permissões na tabela portfolio_items para prestadores
DROP POLICY IF EXISTS "Prestador gerencia proprio portfolio" ON public.portfolio_items;
CREATE POLICY "Prestador gerencia proprio portfolio" ON public.portfolio_items
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.provider_profiles pp
        WHERE pp.id = portfolio_items.provider_id AND pp.user_id = auth.uid()
    ) OR public.is_admin()
);

-- =====================================================================
-- 3. CONFIGURAÇÃO DE BUCKETS DO SUPABASE STORAGE
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('portfolio', 'portfolio', true),
    ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de upload no Storage
DROP POLICY IF EXISTS "Imagens de acesso publico" ON storage.objects;
CREATE POLICY "Imagens de acesso publico" ON storage.objects
FOR SELECT USING (bucket_id IN ('avatars', 'portfolio', 'banners'));

DROP POLICY IF EXISTS "Usuarios autenticados fazem upload" ON storage.objects;
CREATE POLICY "Usuarios autenticados fazem upload" ON storage.objects
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('avatars', 'portfolio', 'banners')
);

-- =====================================================================
-- 4. COMO DEFINIR UMA CONTA COMO ADMINISTRADOR
-- =====================================================================
-- O papel de administrador é atribuído diretamente pelo responsável pelo banco
-- a uma conta já previamente cadastrada com e-mail e senha.
--
-- Exemplo de execução no SQL Editor do Supabase:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@tanamao.com.br';
-- =====================================================================
