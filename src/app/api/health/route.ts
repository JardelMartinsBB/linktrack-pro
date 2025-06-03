import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'LinkTrack Pro API funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0-clean',
    environment: process.env.NODE_ENV || 'development',
    build: 'success',
    features: {
      frontend: '✅ OK',
      api: '✅ OK',
      database: '⏳ Pending',
      auth: '⏳ Pending'
    }
  })
}
