// ===== src/components/dashboard/url-shortener.tsx =====
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, ExternalLink, QrCode, Link } from 'lucide-react'

const linkSchema = z.object({
  url: z.string().url('URL inválida'),
  customCode: z.string().optional(),
  title: z.string().optional(),
})

type LinkFormData = z.infer<typeof linkSchema>

interface ShortLinkResult {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  title: string | null
  qrCodeUrl: string
  createdAt: string
}

interface UrlShortenerProps {
  onLinkCreated: () => void
}

export function UrlShortener({ onLinkCreated }: UrlShortenerProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShortLinkResult | null>(null)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
  })

  const onSubmit = async (data: LinkFormData) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao encurtar URL')
      }

      setResult(responseData.data)
      reset()
      onLinkCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Aqui você pode adicionar uma notificação de sucesso
      alert('Copiado para área de transferência!')
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="mr-2 h-5 w-5" />
            Encurtar Nova URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL para encurtar *
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://exemplo.com/minha-url-muito-longa"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-red-600 mt-1">{errors.url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Código personalizado (opcional)
                </label>
                <Input
                  id="customCode"
                  type="text"
                  placeholder="meu-link"
                  {...register('customCode')}
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para gerar automaticamente
                </p>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título personalizado (opcional)
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título do link"
                  {...register('title')}
                  maxLength={100}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              loading={loading}
            >
              {loading ? 'Encurtando...' : 'Encurtar URL'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                ✅ Link criado com sucesso!
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link encurtado
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={result.shortUrl}
                      readOnly
                      className="flex-1 bg-white"
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
                      Título
                    </label>
                    <p className="text-sm text-gray-600 p-2 bg-white rounded border">
                      {result.title}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL original
                  </label>
                  <p className="text-sm text-gray-600 p-2 bg-white rounded border break-all">
                    {result.originalUrl}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-green-200">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">QR Code disponível</span>
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
        </CardContent>
      </Card>
    </div>
  )
}