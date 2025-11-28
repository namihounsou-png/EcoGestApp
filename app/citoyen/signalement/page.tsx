'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, MapPin, Sparkles, Upload, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { submitReport } from './actions'

type UrgencyLevel = 'low' | 'medium' | 'high'

export default function SignalementPage() {
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium')
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false) // Cette ligne est la clé
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const urgencyConfig = {
    low: { label: 'Faible', message: 'Pas urgent, mais à traiter' },
    medium: { label: 'Moyenne', message: 'À traiter dans les prochains jours' },
    high: { label: 'Haute', message: 'Urgent - Intervention rapide nécessaire' },
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoClick = () => fileInputRef.current?.click()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoFile) {
      setError('Une image est requise pour le signalement.');
      return;
    }
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('photo', photoFile)
    formData.append('urgency', urgency)
    formData.append('description', description)

    try {
      const result = await submitReport(formData)
      if (result.success) {
        setIsSubmitted(true) // C'est cette ligne qui déclenche la page de succès
      } else {
        setError(result.message || 'Une erreur est survenue lors de l\'envoi.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // La logique pour afficher la page de succès est ici
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <Card className="text-center p-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-primary-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-3">
              Signalement bien reçu ! 🎉
            </h2>
            <p className="text-secondary-600 mb-6">
              Merci pour votre contribution ! Votre signalement a été transmis.
            </p>
            <Link href="/citoyen">
              <Button className="w-full">Retour à l'accueil</Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Le formulaire normal est retourné si le signalement n'est pas encore soumis
  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
            <Link href="/citoyen" className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
            </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
          )}
          <Card>
            <label className="block text-sm font-medium text-secondary-700 mb-3">Photo du terrain</label>
            <input type="file" name="photo" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div onClick={handlePhotoClick} className="relative h-64 bg-secondary-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
              {photo ? (
                <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-secondary-900/60 flex flex-col items-center justify-center text-center p-6">
                  <Upload className="w-12 h-12 text-primary-200 mx-auto mb-3" />
                  <p className="text-white font-semibold">Appuyez pour importer une image</p>
                </div>
              )}
            </div>
          </Card>
          
          <Card>
            <label className="block text-sm font-medium text-secondary-700 mb-4">Niveau d'urgence</label>
            <div className="flex justify-between mt-2">
                 <button type="button" onClick={() => setUrgency('low')} className={`text-xs font-medium transition-colors ${urgency === 'low' ? 'text-primary-600' : 'text-secondary-400'}`}>Faible</button>
                 <button type="button" onClick={() => setUrgency('medium')} className={`text-xs font-medium transition-colors ${urgency === 'medium' ? 'text-accent-600' : 'text-secondary-400'}`}>Moyenne</button>
                 <button type="button" onClick={() => setUrgency('high')} className={`text-xs font-medium transition-colors ${urgency === 'high' ? 'text-red-600' : 'text-secondary-400'}`}>Haute</button>
            </div>
          </Card>

          <Card>
            <label className="block text-sm font-medium text-secondary-700 mb-3">Description (optionnel)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Plusieurs sacs à côté du conteneur..." className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows={4} />
          </Card>

          <div className="sticky bottom-0 bg-white pt-4 pb-6 -mx-4 px-4 border-t border-secondary-200">
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
