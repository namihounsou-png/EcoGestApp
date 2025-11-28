'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, CheckCircle, Clock, Navigation, Menu, Bell, Smile } from 'lucide-react'

export default function AgentDashboard() {
  const [currentTask, setCurrentTask] = useState(0)

  // Données simulées de la tournée
  const tournee = {
    total: 12,
    completed: 5,
    remaining: 7,
    estimatedTime: '2h 30min',
    nextLocation: 'Rue de la Paix, 75002',
  }

  const poubelles = [
    { id: 1, address: 'Rue de la Paix, 75002', status: 'pending', fillLevel: 85, priority: 'high' },
    { id: 2, address: 'Avenue des Champs, 75008', status: 'pending', fillLevel: 70, priority: 'medium' },
    { id: 3, address: 'Boulevard Saint-Germain, 75006', status: 'completed', fillLevel: 0, priority: 'low' },
    { id: 4, address: 'Rue de Rivoli, 75001', status: 'pending', fillLevel: 90, priority: 'high' },
    { id: 5, address: 'Place de la République, 75003', status: 'completed', fillLevel: 0, priority: 'low' },
    { id: 6, address: 'Rue Montmartre, 75002', status: 'pending', fillLevel: 65, priority: 'medium' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-accent-100 text-accent-700 border-accent-200'
      default:
        return 'bg-primary-100 text-primary-700 border-primary-200'
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-secondary-900">Ma Tournée Humanisée</h1>
              <p className="text-sm text-secondary-500">
                SGDS-GN • Lomé & Cotonou — Merci pour votre mission du jour 💪
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-secondary-600" />
              </button>
              <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                <Menu className="w-6 h-6 text-secondary-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Card className="p-0 overflow-hidden">
            <div className="relative h-56">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Agent en tournée"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-secondary-900/60 flex flex-col justify-end p-6 text-white">
                <p className="text-sm uppercase tracking-wide text-primary-100 mb-1">Briefing de la matinée</p>
                <h2 className="text-2xl font-semibold">12 points clés - Tournée ANASAP</h2>
                <p className="text-sm text-secondary-100">
                  Anne, superviseuse SGDS-GN : "Merci pour votre énergie, nous sommes derrière vous."
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Panneau d'État - Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-100 text-sm mb-1">Progression de la tournée</p>
                <h2 className="text-4xl font-bold">
                  {tournee.completed}/{tournee.total}
                </h2>
                <p className="text-primary-100 text-sm mt-1">
                  {Math.round((tournee.completed / tournee.total) * 100)}% complété
                </p>
              </div>
              <div className="text-6xl">🚛</div>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full bg-primary-400 rounded-full h-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(tournee.completed / tournee.total) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-white h-3 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Temps estimé : {tournee.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{tournee.remaining} restantes</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Carte avec Itinéraire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-0 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-primary-100 to-primary-200">
              {/* Placeholder pour la carte réelle avec itinéraire */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-6">
                  <p className="text-primary-100 text-sm uppercase tracking-wide mb-2">Itinéraire ANASAP</p>
                  <p className="text-2xl font-semibold">Carte nourrie par vos retours terrain</p>
                  <p className="text-secondary-100 mt-2">
                    Tracés mis à jour après chaque signalement citoyen validé. Merci pour votre réactivité.
                  </p>
                </div>
              </div>

              {/* Marqueurs numérotés simulés */}
              {poubelles.slice(0, 6).map((poubelle, index) => (
                <div
                  key={poubelle.id}
                  className={`absolute ${
                    index === 0 ? 'top-20 left-1/4' :
                    index === 1 ? 'top-32 right-1/4' :
                    index === 2 ? 'bottom-40 left-1/3' :
                    index === 3 ? 'bottom-24 right-1/3' :
                    index === 4 ? 'top-40 left-1/2' :
                    'bottom-32 left-1/5'
                  }`}
                >
                  <div className={`${
                    poubelle.status === 'completed' ? 'bg-primary-500' :
                    poubelle.priority === 'high' ? 'bg-red-500' :
                    poubelle.priority === 'medium' ? 'bg-accent-400' :
                    'bg-secondary-400'
                  } text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white`}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Liste des Poubelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Poubelles à collecter
          </h3>
          <div className="space-y-3">
            {poubelles.map((poubelle, index) => (
              <Card
                key={poubelle.id}
                className={`border-2 ${
                  poubelle.status === 'completed'
                    ? 'border-primary-200 bg-primary-50'
                    : index === currentTask
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Numéro */}
                    <div className={`${
                      poubelle.status === 'completed' ? 'bg-primary-500' :
                      poubelle.priority === 'high' ? 'bg-red-500' :
                      poubelle.priority === 'medium' ? 'bg-accent-400' :
                      'bg-secondary-400'
                    } text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm`}>
                      {index + 1}
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">{poubelle.address}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-secondary-500">
                          Remplissage: {poubelle.fillLevel}%
                        </span>
                        {poubelle.status === 'completed' && (
                          <span className="text-sm text-primary-600 font-medium flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Collectée
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badge Priorité */}
                  {poubelle.status !== 'completed' && (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(poubelle.priority)}`}>
                      {poubelle.priority === 'high' ? 'Urgent' :
                       poubelle.priority === 'medium' ? 'Moyen' : 'Normal'}
                    </div>
                  )}

                  {/* Action */}
                  {poubelle.status === 'pending' && index === currentTask && (
                    <Button size="sm" className="ml-4">
                      Commencer
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Actions Rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <Button variant="outline" className="w-full">
            <Navigation className="w-5 h-5 mr-2" />
            Itinéraire GPS
          </Button>
          <Button variant="outline" className="w-full">
            <Clock className="w-5 h-5 mr-2" />
            Pause
          </Button>
        </motion.div>

        <div className="mt-6 flex items-center space-x-3 text-secondary-500 text-sm">
          <Smile className="w-5 h-5 text-primary-500" />
          <p>
            SGDS-GN & ANASAP enregistrent vos réussites pour inspirer les autres équipes. Mission après mission, vous faites bouger la ville.
          </p>
        </div>
      </main>
    </div>
  )
}


