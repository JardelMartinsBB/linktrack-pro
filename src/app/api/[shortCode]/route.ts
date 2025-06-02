// ===== src/app/[shortCode]/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params
    const supabase = createServerClient()
    
    // Buscar link
    const { data: link, error } = await supabase
      .from('short_links')
      .select('*')
      .eq('short_code', shortCode)
      .single()

    if (error || !link) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // Verificar se expirou
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/expired', request.url))
    }

    // Coletar dados para analytics
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || ''
    const referer = headersList.get('referer') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] || realIp || '127.0.0.1'

    // Extrair informações do User-Agent
    const deviceInfo = parseUserAgent(userAgent)
    
    // Buscar geolocalização (IP-API é gratuito)
    let geoData = null
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}`)
      if (geoResponse.ok) {
        geoData = await geoResponse.json()
      }
    } catch (error) {
      console.warn('Erro ao buscar geolocalização:', error)
    }

    // Registrar clique de forma assíncrona (não bloquear redirect)
    supabase
      .from('link_clicks')
      .insert({
        short_link_id: link.id,
        ip_address: ip,
        user_agent: userAgent,
        referer,
        country: geoData?.country || null,
        region: geoData?.regionName || null,
        city: geoData?.city || null,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        clicked_at: new Date().toISOString()
      })
      .then(({ error }) => {
        if (error) console.error('Erro ao registrar clique:', error)
      })

    // Redirecionar para URL original
    return NextResponse.redirect(link.original_url)

  } catch (error) {
    console.error('Erro no redirect:', error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
}

// Função auxiliar para parseamento de User-Agent
function parseUserAgent(userAgent: string) {
  const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) 
    ? 'mobile' 
    : /Tablet/.test(userAgent) 
    ? 'tablet' 
    : 'desktop'

  let browser = 'Unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'

  let os = 'Unknown'
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS')) os = 'iOS'

  return { deviceType, browser, os }
}