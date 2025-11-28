import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // On crée la réponse AVANT d’écrire les cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // IMPORTANT : on écrit sur la même réponse
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, '', options)
        },
      },
    }
  )

  // Récupérer l’utilisateur
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 🔒 Pages protégées (citoyen, dashboard, profil, etc.)
  const protectedRoutes = ['/citoyen']

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Utilisateur pas connecté → redirection page auth
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Utilisateur déjà connecté → empêche l’accès aux pages auth
  if (user && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/citoyen', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // appliquer le middleware à toutes les pages sauf assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
