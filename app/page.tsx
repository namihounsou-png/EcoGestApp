'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Leaf, Users, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Bienvenue sur EcoGest',
      subtitle: 'Créé avec SGDS-GN (Bénin) & ANASAP (Togo)',
      description:
        'Une communauté engagée qui capture la vraie vie : agents, citoyennes, enfants et associations unis pour des quartiers propres.',
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      badge: 'Mission collective',
    },
    {
      title: 'Signalez en un instant',
      subtitle: 'Chaque photo accélère une intervention',
      description:
        "Un signalement, c'est un quartier qui respire mieux. Partagez ce que vous voyez, nous nous chargeons du reste.",
      image:
        'https://images.unsplash.com/photo-1461532257246-777de18cd58b?auto=format&fit=crop&w=1200&q=80',
      badge: 'Signalement chaleureux',
    },
    {
      title: "Suivez l'impact en temps réel",
      subtitle: 'Des cartes vivantes et des indicateurs inspirants',
      description:
        'Regardez vos contributions transformer la ville : jauges de propreté, tournées optimisées et alertes empathiques.',
      image:
        'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=1200&q=80',
      badge: 'Impact mesurable',
    },
  ]

  // Slider automatique toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-primary-500" />
          <span className="text-2xl font-bold text-secondary-900">EcoGest</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative h-96 mb-12 overflow-hidden rounded-2xl bg-white shadow-soft">
            <AnimatePresence initial={false}>
              {slides.map((slide, index) =>
                index === currentSlide ? (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/20 to-transparent p-8 flex flex-col justify-end text-left">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-white/20 text-white rounded-full mb-4 backdrop-blur">
                        {slide.badge}
                      </span>
                      <h2 className="text-3xl font-bold text-white mb-3">{slide.title}</h2>
                      <p className="text-lg text-primary-100 font-medium mb-4">{slide.subtitle}</p>
                      <p className="text-secondary-100 max-w-2xl">{slide.description}</p>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>

            {/* Dots Navigation */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-primary-500 w-8' : 'bg-secondary-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-card">
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-secondary-900 mb-2">Pour les Citoyens</h3>
              <p className="text-sm text-secondary-600">
                Gardez un lien direct avec votre commune et suivez vos signalements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card">
              <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-secondary-900 mb-2">Pour les Agents</h3>
              <p className="text-sm text-secondary-600">
                Parcours optimisés et instructions claires pour chaque collecte.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card">
              <Leaf className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-secondary-900 mb-2">Pour les Administrateurs</h3>
              <p className="text-sm text-secondary-600">
                Tableaux analytiques SGDS-GN / ANASAP pour coordonner les équipes.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth?mode=login">
              <Button size="lg" className="w-full sm:w-auto">
                Se Connecter <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                S&apos;inscrire
              </Button>
            </Link>
          </div>

          {/* Human Touch Message */}
          <p className="mt-8 text-sm text-secondary-500 italic">
            💚 Créé avec passion par une équipe qui croit en un avenir plus propre
          </p>
        </div>
      </main>
    </div>
  )
}
