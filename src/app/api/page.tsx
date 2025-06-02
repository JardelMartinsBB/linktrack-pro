// ===== src/app/page.tsx =====
import { LinkShortener } from '@/components/LinkShortener'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white py-12">
      <LinkShortener />
    </main>
  )
}
