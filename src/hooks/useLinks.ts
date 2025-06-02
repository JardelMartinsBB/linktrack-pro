// ===== src/hooks/useLinks.ts =====
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

interface PaginatedLinks {
  data: Link[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useLinks(page: number = 1, search: string = '') {
  const [links, setLinks] = useState<PaginatedLinks | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLinks() {
      try {
        setLoading(true)
        setError(null)

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

        setLinks(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [page, search])

  const createLink = async (url: string, customCode?: string, title?: string) => {
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, customCode, title }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar link')
      }

      // Recarregar lista
      setLinks(prev => {
        if (!prev) return prev
        
        const newLink: Link = {
          id: result.data.id,
          short_code: result.data.shortCode,
          original_url: result.data.originalUrl,
          title: result.data.title,
          total_clicks: 0,
          unique_clicks: 0,
          qr_code_url: result.data.qrCodeUrl,
          created_at: result.data.createdAt
        }

        return {
          ...prev,
          data: [newLink, ...prev.data]
        }
      })

      return result.data
    } catch (error) {
      throw error
    }
  }

  return {
    links,
    loading,
    error,
    createLink,
    refetch: () => {
      setLoading(true)
      // Re-trigger useEffect
      setLinks(null)
    }
  }
}