export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Teste Funcionando!</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <ul className="space-y-2">
            <li>✅ Roteamento funcionando</li>
            <li>✅ TypeScript compilando</li>
            <li>✅ Tailwind carregando</li>
          </ul>
          <div className="mt-6">
            <a href="/" className="bg-gray-600 text-white px-4 py-2 rounded">← Voltar</a>
          </div>
        </div>
      </div>
    </div>
  )
}
