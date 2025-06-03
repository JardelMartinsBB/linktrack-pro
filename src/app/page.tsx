export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 LinkTrack Pro
        </h1>
        <p className="text-gray-600 mb-6">
          Projeto configurado com sucesso!
        </p>
        <div className="space-y-3">
          <div className="text-sm text-green-600">✅ Next.js funcionando</div>
          <div className="text-sm text-green-600">✅ TypeScript OK</div>
          <div className="text-sm text-green-600">✅ Tailwind CSS OK</div>
        </div>
        <div className="mt-6">
          <a href="/test" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Página de Teste →
          </a>
        </div>
      </div>
    </main>
  )
}
