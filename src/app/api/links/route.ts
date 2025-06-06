// ===== src/app/api/links/route.ts =====
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar parâmetros de paginação
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    const offset = (page - 1) * limit

    // Query builder
    let query = supabase
      .from('short_links')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // Adicionar filtro de busca se presente
    if (search) {
      query = query.or(`title.ilike.%${search}%,original_url.ilike.%${search}%`)
    }

    // Adicionar paginação
    query = query.range(offset, offset + limit - 1)

    const { data: links, error, count } = await query

    if (error) {
      console.error('Erro ao buscar links:', error)
      return NextResponse.json({ 
        error: 'Erro ao buscar links' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: links,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro na API links:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// DELETE endpoint para deletar links
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Verificar autenticação
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const linkId = searchParams.get('id')

    if (!linkId) {
      return NextResponse.json({ error: 'ID do link é obrigatório' }, { status: 400 })
    }

    // Deletar link (RLS garante que só o dono pode deletar)
    const { error: deleteError } = await supabase
      .from('short_links')
      .delete()
      .eq('id', linkId)
      .eq('user_id', session.user.id)

    if (deleteError) {
      console.error('Erro ao deletar link:', deleteError)
      return NextResponse.json({ 
        error: 'Erro ao deletar link' 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro na API delete:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}