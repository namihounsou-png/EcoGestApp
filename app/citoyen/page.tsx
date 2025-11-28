'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { MapPin, Bell, User, Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// Typage strict pour le statut des signalements
type ReportStatus = 'submitted' | 'resolved' | 'pending'

interface Report {
  id: number
  description: string | null
  status: ReportStatus
  created_at: string
}

interface Stats {
  totalReports: number
  resolvedReports: number
}

export default function CitoyenDashboard() {
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [stats, setStats] = useState<Stats>({ totalReports: 0, resolvedReports: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        const currentUser = data?.user ?? null
        setUser(currentUser)

        if (!currentUser) return

        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('id, description, status, created_at')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })

        if (reportsError) throw reportsError

        const reports = (reportsData ?? []) as Report[]
        setRecentReports(reports.slice(0, 5))
        setStats({
          totalReports: reports.length,
          resolvedReports: reports.filter(r => r.status === 'resolved').length,
        })
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-700'
      case 'resolved':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Mon Quartier</h1>
              <p className="text-sm text-secondary-500">Lomé & Cotonou</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/notifications" className="p-2 hover:bg-secondary-100 rounded-lg">
              <Bell className="w-6 h-6 text-secondary-600" />
            </Link>
            <Link href="/profil" className="p-2 hover:bg-secondary-100 rounded-lg">
              <User className="w-6 h-6 text-secondary-600" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            <Card className="p-20 animate-pulse bg-gray-100 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-10 animate-pulse bg-gray-100 rounded-xl" />
              <Card className="p-10 animate-pulse bg-gray-100 rounded-xl" />
            </div>
            <Card className="p-20 animate-pulse bg-gray-100 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Image principale */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Card className="p-0 overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80"
                    alt="Ville propre"
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Statistiques */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <div className="text-center p-4">
                  <p className="text-2xl font-bold text-primary-500">{stats.totalReports}</p>
                  <p className="text-sm text-secondary-600">Signalements</p>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <p className="text-2xl font-bold text-primary-500">{stats.resolvedReports}</p>
                  <p className="text-sm text-secondary-600">Résolus</p>
                </div>
              </Card>
            </motion.div>

            {/* Derniers signalements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Vos 5 derniers signalements</h3>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <Card key={report.id} className="p-4 flex items-center justify-between">
                      <div className="flex-grow">
                        <p className="font-medium">{report.description ?? `Signalement #${report.id}`}</p>
                        <p className="text-sm text-secondary-500">{new Date(report.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        {report.status === 'submitted' && (
                          <Link href={`/citoyen/signalement/${report.id}/edit`}>
                            <Edit className="w-4 h-4" aria-label="Modifier le signalement" />
                          </Link>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center p-8">
                    <p>Vous n'avez pas encore fait de signalement.</p>
                  </Card>
                )}
              </div>
            </motion.div>
          </>
        )}
      </main>

      {/* Bouton flottant pour ajouter un signalement */}
      <Link href="/citoyen/signalement">
        <motion.button
          className="fixed bottom-6 right-6 bg-primary-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Ajouter un signalement"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </Link>
    </div>
  )
}
