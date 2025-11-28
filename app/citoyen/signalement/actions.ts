'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function createSupabaseServerClient() {
    const cookieStore = cookies()
    return createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => cookieStore.get(name)?.value,
                set: (name, value, options) => cookieStore.set({ name, value, ...options }),
                remove: (name, options) => cookieStore.delete({ name, ...options }),
            },
        }
    )
}

export async function submitReport(formData: FormData) {
  // ... (code de création inchangé)
}

// CORRECTION: L'action ne redirige plus, elle retourne un succès.
export async function updateReport(formData: FormData) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Utilisateur non authentifié')

  const reportId = formData.get('reportId') as string
  const description = formData.get('description') as string
  const urgency = formData.get('urgency') as string
  const photoFile = formData.get('photo') as File | null

  const updates: any = {
    description,
    urgency_level: urgency === 'low' ? 0.3 : urgency === 'medium' ? 0.6 : 0.9,
  }

  if (photoFile && photoFile.size > 0) {
    const fileName = `${user.id}/${reportId}_${Date.now()}`
    const { error: uploadError } = await supabase.storage.from('report_images').upload(fileName, photoFile, { upsert: true })
    if (uploadError) throw new Error(`Erreur d'upload: ${uploadError.message}`)
    updates.image_url = supabase.storage.from('report_images').getPublicUrl(fileName).data.publicUrl
  }

  const { error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', reportId)
    .eq('user_id', user.id)
    .eq('status', 'submitted')

  if (error) {
    throw new Error(`Erreur de mise à jour: ${error.message}`)
  }

  revalidatePath('/citoyen')
  revalidatePath(`/citoyen/signalement/${reportId}`)

  // Au lieu de rediriger, on retourne un succès.
  return { success: true, message: 'Signalement mis à jour !' }
}
