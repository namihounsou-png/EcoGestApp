import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  // Redirige vers le formulaire login après confirmation
  const redirectTo = `${url.origin}/auth?mode=login&confirmed=true`

  if (!code) {
    return NextResponse.redirect(redirectTo)
  }

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set(name, value, options)
        },
        remove(name, options) {
          cookieStore.delete(name)
        },
      },
    }
  )

  // Échange le code pour créer la session utilisateur
  await supabase.auth.exchangeCodeForSession(code)

  return NextResponse.redirect(redirectTo)
}
