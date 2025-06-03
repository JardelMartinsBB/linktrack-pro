// ===== src/components/dashboard/stats-overview.tsx =====
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import { Link, MousePointer, Users, TrendingUp } from 'lucide-react'

interface Stats {
  totalLinks: number
  totalClicks: number
  uniqueClicks: number
  clicksToday: number
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats>({
    totalLinks: 0,
    totalClicks: 0,
    uniqueClicks: 0,
    clicksToday: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de stats
    // Em implementação real, buscar de API
    setTimeout(() => {
      setStats({
        totalLinks: 12,
        totalClicks: 234,
        uniqueClicks: 189,
        clicksToday: 23
      })
      setLoading(false)
    }, 1000)
  }, [])

  const statCards = [
    {
      title: 'Total de Links',
      value: stats.totalLinks,
      icon: Link,
      color: 'text-blue-600'
    },
    {
      title: 'Total de Cliques',
      value: stats.totalClicks,
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      title: 'Cliques Únicos',
      value: stats.uniqueClicks,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Cliques Hoje',
      value: stats.clicksToday,
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stat.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
