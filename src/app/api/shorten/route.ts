// ===== src/app/api/shorten/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUrl } from '@/lib/utils'
import { z } from 'zod'

const shortenSchema = z.object({
  url: z.string().url('URL inválida'),
  customCode: z.string().optional(),
  title: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, customCode, title } = shortenSchema.parse(body)
    
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Validar URL
    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
    }

    // Verificar se usuário pode criar mais links
    const { data: canCreate, error: limitError } = await supabase.rpc('can_create_link', {
      user_uuid: session.user.id
    })

    if (limitError || !canCreate) {
      return NextResponse.json({ 
        error: 'Limite de links atingido. Faça upgrade do seu plano.' 
      }, { status: 403 })
    }

    // Gerar código único
    let shortCode = customCode
    if (!shortCode) {
      const { data: generatedCode, error: codeError } = await supabase.rpc('generate_short_code')
      if (codeError || !generatedCode) {
        return NextResponse.json({ 
          error: 'Erro ao gerar código único' 
        }, { status: 500 })
      }
      shortCode = generatedCode
    } else {
      // Verificar se código customizado já existe
      const { data: existing } = await supabase
        .from('short_links')
        .select('id')
        .eq('short_code', customCode)
        .single()
      
      if (existing) {
        return NextResponse.json({ 
          error: 'Código personalizado já está em uso' 
        }, { status: 400 })
      }
    }

    // Buscar metadados da URL (título, favicon)
    let linkTitle = title
    let favicon = null
    
    if (!linkTitle) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch(url, { 
          headers: { 'User-Agent': 'LinkTrack-Bot/1.0' },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        const html = await response.text()
        
        // Extrair título
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        if (titleMatch) {
          linkTitle = titleMatch[1].trim()
        }
        
        // Extrair favicon
        const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)
        if (faviconMatch) {
          const faviconUrl = faviconMatch[1]
          favicon = faviconUrl.startsWith('http') ? faviconUrl : new URL(faviconUrl, url).href
        }
      } catch (error) {
        // Ignorar erros de metadados - não são críticos
        console.warn('Erro ao buscar metadados:', error)
      }
    }

    // Gerar QR Code (serviço gratuito)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`)}`

    // Inserir link no banco
    const { data: shortLink, error: insertError } = await supabase
      .from('short_links')
      .insert({
        user_id: session.user.id,
        original_url: url,
        short_code: shortCode,
        title: linkTitle,
        favicon_url: favicon,
        qr_code_url: qrCodeUrl
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir link:', insertError)
      return NextResponse.json({ 
        error: 'Erro interno do servidor' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: shortLink.id,
        shortCode,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`,
        originalUrl: url,
        title: linkTitle,
        qrCodeUrl,
        createdAt: shortLink.created_at
      }
    })

  } catch (error) {
    console.error('Erro na API shorten:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}