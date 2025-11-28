import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Lire un cookie
        get(name) {
          if (typeof document === 'undefined') return null
          return (
            document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`))
              ?.split('=')[1] || null
          )
        },

        // Écrire un cookie
        set(name, value, options) {
          if (typeof document === 'undefined') return
          let cookie = `${name}=${value}; path=/;`
          if (options?.maxAge) cookie += ` max-age=${options.maxAge};`
          document.cookie = cookie
        },

        // Supprimer un cookie
        remove(name) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; path=/; max-age=0;`
        },

        // Supabase demande parfois getAll et setAll → on les fournit
        getAll() {
          if (typeof document === 'undefined') return []
          return document.cookie.split('; ').map((cookie) => {
            const [name, ...rest] = cookie.split('=')
            return { name, value: rest.join('=') }
          })
        },

        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            this.set(name, value, options)
          })
        },
      },
    }
  )
