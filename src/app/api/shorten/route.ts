// ===== src/app/api/shorten/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUrl, generateShortCode } from '@/lib/utils'
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
    const { data: canCreate } = await supabase.rpc('can_create_link', {
      user_uuid: session.user.id
    })

    if (!canCreate) {
      return NextResponse.json({ 
        error: 'Limite de links atingido. Faça upgrade do seu plano.' 
      }, { status: 403 })
    }

    // Gerar código único
    let shortCode = customCode || generateShortCode(6)
    let attempts = 0
    
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('short_links')
        .select('id')
        .eq('short_code', shortCode)
        .single()
      
      if (!existing) break
      
      shortCode = generateShortCode(6 + attempts) // Aumentar tamanho se necessário
      attempts++
    }

    if (attempts >= 10) {
      return NextResponse.json({ 
        error: 'Não foi possível gerar código único' 
      }, { status: 500 })
    }

    // Buscar metadados da URL (título, favicon)
    let linkTitle = title
    let favicon = null
    
    if (!linkTitle) {
      try {
        const response = await fetch(url, { 
          headers: { 'User-Agent': 'LinkTrack-Bot/1.0' },
          signal: AbortSignal.timeout(5000) // 5s timeout
        })
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

    // Inserir link no banco
    const { data: shortLink, error: insertError } = await supabase
      .from('short_links')
      .insert({
        user_id: session.user.id,
        original_url: url,
        short_code: shortCode,
        title: linkTitle,
        favicon_url: favicon
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir link:', insertError)
      return NextResponse.json({ 
        error: 'Erro interno do servidor' 
      }, { status: 500 })
    }

    // Gerar QR Code (serviço gratuito)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`)}`

    // Atualizar com QR code
    await supabase
      .from('short_links')
      .update({ qr_code_url: qrCodeUrl })
      .eq('id', shortLink.id)

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