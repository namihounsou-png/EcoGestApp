'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, User, LogOut, Camera, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { updateAvatar, updateName } from './actions'

interface Profile {
  full_name: string | null
  avatar_url: string | null
}

export default function ProfilPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUser(user)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') setError('Impossible de charger le profil.')
      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setIsUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('avatar', file)
    const result = await updateAvatar(formData)
    if (result.success && result.avatar_url) {
      setProfile(prev => prev ? { ...prev, avatar_url: result.avatar_url } : { full_name, avatar_url: result.avatar_url })
      alert('Avatar mis à jour !')
    } else {
      setError(result.error || 'Erreur lors du changement d\'avatar.')
    }
    setIsUploading(false)
  }

  const handleNameUpdate = async () => {
    if (!fullName.trim()) return alert('Le nom ne peut pas être vide.')
    setIsSavingName(true)
    setError(null)
    const result = await updateName(fullName)
    if (result.success) {
      setProfile(prev => prev ? { ...prev, full_name: fullName } : { full_name, avatar_url: null })
      alert('Nom mis à jour !')
    } else {
      setError(result.error || 'Erreur lors de la mise à jour du nom.')
    }
    setIsSavingName(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) return <div className="p-10 text-center">Chargement...</div>

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto">
          <Link href="/citoyen" className="inline-flex items-center text-secondary-600 hover:text-secondary-900">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900 mt-2">Mon Profil</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-xl mx-auto p-8 space-y-8">
          {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*"/>
            <div className="relative">
              <div className="w-32 h-32 bg-secondary-200 rounded-full flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" width={128} height={128} className="object-cover rounded-full"/>
                ) : (
                  <User className="w-16 h-16 text-secondary-400"/>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary-500 text-white p-3 rounded-full shadow-lg" disabled={isUploading}>
                {isUploading ? '...' : <Camera className="w-5 h-5"/>}
              </button>
            </div>
          </div>

          {/* Nom complet */}
          <div className="w-full text-left space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700">Nom complet</label>
            <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 border rounded-lg"/>
            <Button onClick={handleNameUpdate} disabled={isSavingName} className="w-full">
              <Save className="w-4 h-4 mr-2"/>{isSavingName ? 'Enregistrement...' : 'Enregistrer le nom'}
            </Button>
          </div>

          <div className="border-t w-full my-6"></div>

          <Button onClick={handleLogout} variant="destructive" className="w-full max-w-xs">
            <LogOut className="w-4 h-4 mr-2"/>Se déconnecter
          </Button>
        </Card>
      </main>
    </div>
  )
}

