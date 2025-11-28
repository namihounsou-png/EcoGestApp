'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import { updateReport } from '../../actions'

type UrgencyLevel = 'low' | 'medium' | 'high'

export default function EditSignalementPage() {
  const supabase = createClient()
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [urgency, setUrgency] = useState<UrgencyLevel>('medium')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('reports')
        .select('description, urgency_level, image_url, status')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError("Impossible de charger les données du signalement.");
        setLoading(false);
        return;
      }
      
      if (data.status !== 'submitted') {
        alert("Ce signalement ne peut plus être modifié.");
        router.push('/citoyen');
        return;
      }

      setDescription(data.description || '')
      setPhoto(data.image_url)
      if (data.urgency_level >= 0.8) setUrgency('high');
      else if (data.urgency_level >= 0.5) setUrgency('medium');
      else setUrgency('low');

      setLoading(false)
    }
    fetchReport()
  }, [id, supabase, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('reportId', id as string)
    formData.append('description', description)
    formData.append('urgency', urgency)
    if (photoFile) {
      formData.append('photo', photoFile)
    }

    try {
      const result = await updateReport(formData)
      if (result.success) {
        alert('Signalement mis à jour !');
        router.refresh()
        router.push('/citoyen')
      } else {
        setError(result.message || "Une erreur inconnue est survenue.")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-10 text-center">Chargement...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-card sticky top-0 z-10 py-4 px-4">
        <div className="max-w-2xl mx-auto">
            <Link href={`/citoyen`} className="inline-flex items-center text-secondary-600 hover:text-secondary-900"><ArrowLeft className="w-4 h-4 mr-2" />Retour au tableau de bord</Link>
            <h1 className="text-2xl font-bold mt-2">Modifier le Signalement #{id}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
          
          <Card className="p-6">
            <label className="block text-sm font-medium text-secondary-700 mb-3">Modifier la photo</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div onClick={() => fileInputRef.current?.click()} className="relative h-64 bg-secondary-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
              {photo && <Image src={photo} alt="Aperçu du signalement" fill className="object-cover" />}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"><Upload className="w-8 h-8 mr-2" /> Changer l&apos;image</div>
            </div>
          </Card>

          <Card className="p-6">
            <label className="block text-sm font-medium text-secondary-700 mb-4">Niveau d&apos;urgence</label>
            <div className="flex justify-around"><button type="button" onClick={() => setUrgency('low')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${urgency === 'low' ? 'bg-primary-500 text-white' : 'bg-secondary-100'}`}>Faible</button><button type="button" onClick={() => setUrgency('medium')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${urgency === 'medium' ? 'bg-accent-500 text-white' : 'bg-secondary-100'}`}>Moyenne</button><button type="button" onClick={() => setUrgency('high')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${urgency === 'high' ? 'bg-red-500 text-white' : 'bg-secondary-100'}`}>Haute</button></div>
          </Card>

          <Card className="p-6">
            <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-3">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-lg" rows={4} />
          </Card>

          <div className="sticky bottom-0 py-4 bg-white/80 backdrop-blur-sm border-t"><Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}</Button></div>
        </form>
      </main>
    </div>
  )
}
