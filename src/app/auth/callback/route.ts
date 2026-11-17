import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Supabase Auth Callback Handler
 * Trata o redirecionamento pós-confirmação de e-mail e login mágico.
 * Redireciona conforme o papel oficial do usuário:
 * - Clientes -> Busca (/explorar)
 * - Prestadores e Lojas -> Painel de Anúncios (/painel)
 * - Administradores -> Painel Admin (/admin)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('sua-url-aqui')) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server component / route handler cookie setter
            }
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        // Busca o papel na tabela profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const role = profile?.role || data.user.user_metadata?.role || 'customer';

        if (next) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        if (role === 'admin') {
          return NextResponse.redirect(`${origin}/admin`);
        } else if (role === 'provider' || role === 'store') {
          return NextResponse.redirect(`${origin}/painel`);
        } else {
          return NextResponse.redirect(`${origin}/explorar`);
        }
      }
    }
  }

  // Redirecionamento de segurança em caso de falha no código
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
