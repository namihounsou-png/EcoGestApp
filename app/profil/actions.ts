'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function createSupabaseServerClient() {
    const cookieStore = cookies()
    return createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => cookieStore.get(name)?.value,
                set: (name: string, value: string, options: any) => cookieStore.set({ name, value, ...options }),
                remove: (name: string, options: any) => cookieStore.delete({ name, ...options }),
            },
        }
    )
}

export async function updateAvatar(formData: FormData) {
    try {
        const supabase = createSupabaseServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Utilisateur non authentifié')

        const avatarFile = formData.get('avatar') as File
        if (!avatarFile) throw new Error("Aucun fichier n'a été fourni.")

        const filePath = `${user.id}/avatar`
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

        const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
        if (updateError) throw updateError

        return { success: true, avatar_url: publicUrl }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateName(fullName: string) {
    try {
        const supabase = createSupabaseServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Utilisateur non authentifié')

        if (!fullName || fullName.trim().length < 2) throw new Error('Le nom doit contenir au moins 2 caractères.')

        const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
