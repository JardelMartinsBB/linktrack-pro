// ===== src/app/page.tsx (LIMPO) =====
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 LinkTrack Pro
          </h1>
          <p className="text-gray-600 mb-6">
            URL Shortener SaaS - Deploy Funcionando!
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-green-800 font-semibold mb-2">✅ Status</h2>
            <div className="text-sm text-green-700 space-y-1">
              <div>✅ Next.js 14 - OK</div>
              <div>✅ TypeScript - OK</div>
              <div>✅ Tailwind CSS - OK</div>
              <div>✅ Build - OK</div>
              <div>✅ Deploy - OK</div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            <p>Timestamp: {new Date().toLocaleString('pt-BR')}</p>
            <p>Versão: MVP Clean 1.0</p>
          </div>

          <div className="space-y-3">
            <a 
              href="/test"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🧪 Página de Teste
            </a>
            <a 
              href="/api/health"
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              🏥 API Health Check
            </a>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              🎉 Projeto limpo e funcionando!<br/>
              Próximo: Implementar funcionalidades do encurtador
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}