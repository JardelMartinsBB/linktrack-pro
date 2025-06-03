// ===== src/app/(auth)/register/page.tsx =====
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return <RegisterForm />
}

// ===== src/app/api/auth/callback/route.ts =====
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}