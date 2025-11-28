'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, User, LogOut, Camera, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { updateAvatar, updateName } from './actions'

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
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
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .limit(1) // Pour éviter les erreurs de doublons
          .single()
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = 0 ligne trouvée, ce qui est ok
            setError(`Erreur de chargement: ${error.message}`)
        } else if (data) {
          setProfile(data)
          setFullName(data.full_name || '')
        }
      }
      setLoading(false)
    }
    fetchUserData()
  }, [supabase])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setIsUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('avatar', file)
    
    const result = await updateAvatar(formData)
    if (result.success && result.avatar_url) {
      if (profile) setProfile({ ...profile, avatar_url: result.avatar_url })
      else setProfile({ full_name: fullName, avatar_url: result.avatar_url })
    } else {
      setError(result.error || "Erreur lors du changement d'avatar.")
    }
    setIsUploading(false)
  }

  const handleNameUpdate = async () => {
    setIsSavingName(true)
    setError(null)
    const result = await updateName(fullName)
    if (result.success) {
      if(profile) setProfile({ ...profile, full_name: fullName })
      alert('Nom mis à jour avec succès !')
    } else {
      setError(result.error || "Erreur lors de la mise à jour du nom.")
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
            <Link href="/citoyen" className="inline-flex items-center text-secondary-600 hover:text-secondary-900"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Link>
            <h1 className="text-3xl font-bold text-secondary-900 mt-2">Mon Profil</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-xl mx-auto p-8">
            {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg mb-6"><strong>Erreur:</strong> {error}</p>}
          <div className="flex flex-col items-center space-y-8">
            {/* SECTION AVATAR RESTAURÉE */}
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
            <div className="relative">
              <div className="w-32 h-32 bg-secondary-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (<img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />) : (<User className="w-16 h-16 text-secondary-400" />)}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary-500 text-white p-3 rounded-full shadow-lg" disabled={isUploading}>
                {isUploading ? "..." : <Camera className="w-5 h-5"/>}
              </button>
            </div>

            {/* SECTION NOM (INCHANGÉE) */}
            <div className="w-full text-left space-y-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700">Nom complet</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 border rounded-lg"/>
                <Button onClick={handleNameUpdate} disabled={isSavingName} className="w-full">
                    <Save className="w-4 h-4 mr-2" />{isSavingName ? 'Enregistrement...' : 'Enregistrer le nom'}
                </Button>
            </div>

            <div className="border-t w-full my-6"></div>

            {/* BOUTON DÉCONNEXION (INCHANGÉ) */}
            <Button onClick={handleLogout} variant="destructive" className="w-full max-w-xs">
              <LogOut className="w-4 h-4 mr-2" />Se déconnecter
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
