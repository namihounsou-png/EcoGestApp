'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface ReportDetails {
  id: number
  created_at: string
  image_url: string
  description: string | null
  status: string
  urgency_level: number
}

export default function SignalementDetailPage() {
  const supabase = createClient()
  const params = useParams()
  const { id } = params

  const [report, setReport] = useState<ReportDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!id) return
      setLoading(true)
      try {
        const { data, error } = await supabase.from('reports').select('*').eq('id', id).single()
        if (error) {
          console.error('Error fetching report details:', error)
          setError('Impossible de charger les détails de ce signalement.')
        } else {
          setReport(data)
        }
      } catch (err) {
        console.error(err)
        setError('Une erreur est survenue.')
      } finally {
        setLoading(false)
      }
    }

    fetchReportDetails()
  }, [id, supabase])

  const getUrgencyConfig = (level: number) => {
    if (level >= 0.8) return { label: 'Haute', color: 'text-red-700', bg: 'bg-red-100' }
    if (level >= 0.5) return { label: 'Moyenne', color: 'text-yellow-700', bg: 'bg-yellow-100' }
    return { label: 'Faible', color: 'text-green-700', bg: 'bg-green-100' }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700'
      case 'resolved':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Variables pour éviter tout rendu côté serveur
  const urgencyConfig = report ? getUrgencyConfig(report.urgency_level) : { label: '', color: '', bg: '' }
  const statusBadge = report ? getStatusBadge(report.status) : ''

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/citoyen"
            className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading && <p className="text-center py-10">Chargement des détails...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="max-w-2xl mx-auto overflow-hidden">
              <div className="relative w-full h-80">
                <Image
                  src={report.image_url}
                  alt={`Image du signalement #${report.id}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 space-y-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-secondary-900">Signalement #{report.id}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusBadge}`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                </div>

                {report.description ? (
                  <p className="text-secondary-700">{report.description}</p>
                ) : (
                  <p className="text-sm text-secondary-400 italic">Aucune description fournie.</p>
                )}

                <div className="border-t border-secondary-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${urgencyConfig.bg}`}>
                    <div className="flex items-center">
                      <AlertTriangle className={`w-5 h-5 mr-3 ${urgencyConfig.color}`} />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">Niveau d&apos;urgence</p>
                        <p className={`font-bold ${urgencyConfig.color}`}>{urgencyConfig.label}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-secondary-500" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">Date du signalement</p>
                        <p className="font-bold text-secondary-600">
                          {new Date(report.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary-50 p-3 rounded-lg col-span-1 md:col-span-2">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-secondary-500" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">Localisation</p>
                        <p className="font-bold text-secondary-600">(Coordonnées bientôt disponibles)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
