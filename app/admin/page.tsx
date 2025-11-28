'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Menu,
  Bell,
  BarChart3,
  LineChart,
  Shield,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { label: 'Vue globale', icon: BarChart3 },
  { label: 'Tournées SGDS-GN', icon: LineChart },
  { label: 'Tournées ANASAP', icon: Shield },
  { label: 'Alertes critiques', icon: AlertTriangle },
  { label: 'Paramètres', icon: Menu },
]

const organizations = [
  { name: 'SGDS-GN (Bénin)', status: 'Opérations fluides', color: 'text-primary-300' },
  { name: 'ANASAP (Togo)', status: 'Surveillance renforcée', color: 'text-warning-300' },
]

const kpis = [
  {
    label: 'Signalements ouverts',
    value: 47,
    trend: '+5% vs hier',
    accent: 'from-primary-500 to-primary-600',
    icon: AlertCircle,
  },
  {
    label: 'Taux de résolution',
    value: '68%',
    trend: 'Mission en progression',
    accent: 'from-secondary-700 to-secondary-800',
    icon: TrendingUp,
  },
  {
    label: 'Alertes 90%+',
    value: 8,
    trend: 'Plan d&apos;action en cours',
    accent: 'from-red-500 to-red-600',
    icon: AlertTriangle,
  },
  {
    label: 'Agents actifs',
    value: 12,
    trend: 'SGDS-GN x8 • ANASAP x4',
    accent: 'from-secondary-800 to-secondary-900',
    icon: Users,
  },
]

const alertesData = [
  { name: '70-79%', value: 12, fill: '#22c55e' },
  { name: '80-89%', value: 18, fill: '#fb923c' },
  { name: '90%+', value: 8, fill: '#ef4444' },
]

const weeklyData = [
  { day: 'Lun', signalements: 12, resolus: 8 },
  { day: 'Mar', signalements: 15, resolus: 12 },
  { day: 'Mer', signalements: 18, resolus: 14 },
  { day: 'Jeu', signalements: 14, resolus: 11 },
  { day: 'Ven', signalements: 16, resolus: 13 },
  { day: 'Sam', signalements: 10, resolus: 7 },
  { day: 'Dim', signalements: 8, resolus: 6 },
]

const recentSignalements = [
  { id: 1, type: 'Poubelle pleine', location: 'Cotonou • Akpakpa', urgency: 'high', time: 'Il y a 5 min' },
  { id: 2, type: 'Déchets sauvages', location: 'Lomé • Agoè', urgency: 'medium', time: 'Il y a 15 min' },
  { id: 3, type: 'Conteneur cassé', location: 'Cotonou • Gbégamey', urgency: 'low', time: 'Il y a 1 h' },
]

const getUrgencyClasses = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return 'bg-red-500/10 text-red-300 border-red-500/40'
    case 'medium':
      return 'bg-accent-500/10 text-accent-200 border-accent-500/40'
    default:
      return 'bg-primary-500/10 text-primary-200 border-primary-500/40'
  }
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-secondary-950 text-white flex">
      <aside className="hidden lg:flex w-72 flex-col border-r border-secondary-800 bg-secondary-950/80 backdrop-blur-lg px-6 py-8 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary-500 mb-2">EcoGest</p>
          <h1 className="text-xl font-bold">Supervision centrale</h1>
          <p className="text-sm text-secondary-400">SGDS-GN & ANASAP</p>
        </div>

        <div className="space-y-4">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-colors ${
                  index === 0 ? 'bg-primary-500/10 text-white' : 'text-secondary-400 hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </span>
                {index === 0 && (
                  <span className="text-xs uppercase tracking-wide text-primary-200">En direct</span>
                )}
              </button>
            )
          })}
        </div>

        <div className="space-y-4 mt-auto">
          {organizations.map((org) => (
            <div key={org.name} className="p-4 rounded-xl border border-secondary-800 bg-secondary-900/40">
              <p className="text-sm font-semibold">{org.name}</p>
              <p className={`text-xs mt-1 ${org.color}`}>{org.status}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-secondary-800 bg-secondary-950/70 backdrop-blur sticky top-0 z-20">
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-secondary-400 uppercase tracking-[0.4em]">Espace administrateur</p>
              <h2 className="text-2xl font-semibold mt-1">Tableau de bord humanisé</h2>
              <p className="text-sm text-secondary-400">
                Bienvenue ! Les équipes terrain sont à l&apos;écoute de vos décisions stratégiques.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full border border-secondary-700 hover:border-primary-500 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full border border-secondary-700 hover:border-primary-500 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <Button className="bg-primary-500 text-white border-none">Publier un message aux équipes</Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className={`bg-gradient-to-br ${kpi.accent} text-white border border-white/10`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/60">{kpi.label}</p>
                        <h3 className="text-3xl font-bold mt-2">{kpi.value}</h3>
                        <p className="text-sm text-white/70">{kpi.trend}</p>
                      </div>
                      <div className="bg-white/15 rounded-full p-3">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="col-span-2 bg-secondary-900 border border-secondary-800 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Répartition des alertes de remplissage</h3>
                  <p className="text-sm text-secondary-400">
                    Couleur d&apos;alerte activée dès 80% — priorité aux zones sensibles.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wide text-accent-300">Données live</span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={alertesData}
                    cx="45%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {alertesData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-secondary-900 border border-secondary-800 text-white">
              <h3 className="text-lg font-semibold">Activité hebdomadaire</h3>
              <p className="text-sm text-secondary-400 mb-4">Lecture rapide par jour pour anticiper vos ressources.</p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                  <Bar dataKey="signalements" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="resolus" fill="#fb923c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2 bg-secondary-900 border border-secondary-800 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Signalements récents</h3>
                  <p className="text-sm text-secondary-400">Micro-feedbacks citoyens • Ton empathique obligatoire.</p>
                </div>
                <Button variant="outline">Exporter le suivi</Button>
              </div>
              <div className="space-y-3">
                {recentSignalements.map((signalement) => (
                  <div
                    key={signalement.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-secondary-800 bg-secondary-900/60"
                  >
                    <div>
                      <p className="font-medium">{signalement.type}</p>
                      <p className="text-xs text-secondary-400">{signalement.location}</p>
                      <p className="text-xs text-secondary-500 mt-1">
                        Message envoyé : &quot;Signalement bien reçu ! Merci pour votre vigilance 💚&quot;
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyClasses(signalement.urgency)}`}>
                        {signalement.urgency === 'high' ? 'Critique' : signalement.urgency === 'medium' ? 'À planifier' : 'Surveiller'}
                      </span>
                      <span className="text-xs text-secondary-500">{signalement.time}</span>
                      <Button size="sm" variant="outline">
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-secondary-900 border border-secondary-800 text-white flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Voix des organisations</h3>
              <div className="space-y-4 flex-1">
                <div className="border border-secondary-800 rounded-xl p-4">
                  <p className="text-sm text-secondary-300 mb-1">SGDS-GN</p>
                  <p className="font-semibold">&quot;Mission accomplie ! Le quartier Saint-Jean est redevenu respirable.&quot;</p>
                  <p className="text-xs text-secondary-500 mt-2">Coordination locale • 09:12</p>
                </div>
                <div className="border border-secondary-800 rounded-xl p-4">
                  <p className="text-sm text-secondary-300 mb-1">ANASAP</p>
                  <p className="font-semibold">&quot;Nouvelle tournée solidaire prévue demain avec les associations du littoral.&quot;</p>
                  <p className="text-xs text-secondary-500 mt-2">Direction générale • 07:48</p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2 text-secondary-400 text-sm">
                <Sparkles className="w-4 h-4 text-primary-300" />
                <span>Chaque message est relu pour conserver le ton humain et chaleureux.</span>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

