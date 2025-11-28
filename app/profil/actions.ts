'use server'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function updateAvatar(formData: FormData) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté.')

    const file = formData.get('avatar') as File
    if (!file) throw new Error('Fichier manquant.')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload dans Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (uploadError) throw uploadError

    // Obtenir URL publique
    const { publicURL } = supabase.storage.from('avatars').getPublicUrl(filePath)

    // Mettre à jour la table profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicURL })
      .eq('id', user.id)

    if (updateError) throw updateError

    return { success: true, avatar_url: publicURL }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateName(full_name: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Utilisateur non connecté.')

    const { error } = await supabase
      .from('profiles')
      .update({ full_name })
      .eq('id', user.id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

