

// ===== src/app/dashboard/page.tsx =====
'use client'

import { useState } from 'react'
import { UrlShortener } from '@/components/dashboard/url-shortener'
import { LinksList } from '@/components/dashboard/links-list'
import { StatsOverview } from '@/components/dashboard/stats-overview'

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLinkCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600">
          Gerencie seus links encurtados e acompanhe estatísticas
        </p>
      </div>

      <StatsOverview />
      
      <UrlShortener onLinkCreated={handleLinkCreated} />
      
      <LinksList refreshTrigger={refreshTrigger} />
    </div>
  )
}