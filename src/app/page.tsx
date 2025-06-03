// ===== src/app/page.tsx (ATUALIZADA com Auth) =====
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createServerClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 LinkTrack Pro
          </h1>
          <p className="text-gray-600 mb-6">
            Encurte URLs e acompanhe analytics em tempo real
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-green-800 font-semibold mb-2">✅ Sistema Funcional</h2>
            <div className="text-sm text-green-700 space-y-1">
              <div>✅ Frontend + Backend</div>
              <div>✅ Autenticação</div>
              <div>✅ Database</div>
              <div>✅ Deploy</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {session ? (
              <>
                <p className="text-sm text-gray-600">
                  Bem-vindo, {session.user.email}!
                </p>
                <Link href="/dashboard">
                  <Button className="w-full">
                    Ir para Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button className="w-full">
                    Começar Grátis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Já tenho conta
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div>• 10 links grátis</div>
            <div>• Analytics em tempo real</div>
            <div>• QR codes automáticos</div>
          </div>
        </div>
      </div>
    </main>
  )
}