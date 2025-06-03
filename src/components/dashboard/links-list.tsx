// ===== src/components/dashboard/links-list.tsx =====
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatNumber } from '@/lib/utils'
import { Search, ExternalLink, Copy, Trash2, BarChart3, Eye } from 'lucide-react'

interface Link {
  id: string
  short_code: string
  original_url: string
  title: string | null
  total_clicks: number
  unique_clicks: number
  qr_code_url: string | null
  created_at: string
}

interface LinksListProps {
  refreshTrigger: number
}

export function LinksList({ refreshTrigger }: LinksListProps) {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search
      })

      const response = await fetch(`/api/links?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar links')
      }

      setLinks(result.data)
      setTotalPages(result.pagination.totalPages)
    } catch (err) {
      console.error('Erro ao carregar links:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [page, search, refreshTrigger])

  const deleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return

    try {
      const response = await fetch(`/api/links?id=${linkId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar link')
      }

      fetchLinks() // Recarregar lista
    } catch (err) {
      console.error('Erro ao deletar link:', err)
      alert('Erro ao deletar link')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copiado!')
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Meus Links</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum link encontrado
            </h3>
            <p className="text-gray-500">
              {search ? 'Tente uma busca diferente' : 'Crie seu primeiro link encurtado acima'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {link.title || 'Link sem título'}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(link.total_clicks)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {process.env.NEXT_PUBLIC_APP_URL}/{link.short_code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/${link.short_code}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_APP_URL}/${link.short_code}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate">
                        {link.original_url}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Criado em {formatDate(link.created_at)}</span>
                        <div className="flex items-center space-x-2">
                          <span>Cliques: {link.total_clicks} | Únicos: {link.unique_clicks}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    {link.qr_code_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(link.qr_code_url!, '_blank')}
                        title="Ver QR Code"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLink(link.id)}
                      title="Deletar link"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}