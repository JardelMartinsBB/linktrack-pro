// ===== src/components/LinkShortener.tsx =====
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, ExternalLink, QrCode } from 'lucide-react'

interface ShortLinkResult {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  title: string | null
  qrCodeUrl: string
  createdAt: string
}

export function LinkShortener() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShortLinkResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          customCode: customCode.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao encurtar URL')
      }

      setResult(data.data)
      setUrl('')
      setCustomCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copiado para área de transferência!')
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          LinkTrack Pro
        </h1>
        <p className="text-gray-600">
          Encurte seus links e acompanhe as estatísticas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL para encurtar
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://exemplo.com/minha-url-muito-longa"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código personalizado (opcional)
          </label>
          <Input
            id="customCode"
            type="text"
            placeholder="meu-link"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            Deixe em branco para gerar automaticamente
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !url.trim()}
        >
          {loading ? 'Encurtando...' : 'Encurtar URL'}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Link criado com sucesso! 🎉
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link encurtado
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  value={result.shortUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.shortUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(result.shortUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {result.title && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da página
                </label>
                <p className="text-sm text-gray-600">{result.title}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL original
              </label>
              <p className="text-sm text-gray-600 break-all">{result.originalUrl}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">QR Code disponível</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(result.qrCodeUrl, '_blank')}
              >
                Ver QR Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
