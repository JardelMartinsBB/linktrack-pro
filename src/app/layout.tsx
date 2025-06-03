// ===== src/app/layout.tsx (LIMPO) =====
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkTrack Pro - URL Shortener',
  description: 'Encurtador de URLs com analytics avançados',
  keywords: ['url shortener', 'analytics', 'links', 'tracking'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}