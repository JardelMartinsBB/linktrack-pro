// ===== src/lib/supabase/middleware.ts =====
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createMiddlewareClient<Database>({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  // Rotas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirecionar usuários logados das páginas de auth
  if (session && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}