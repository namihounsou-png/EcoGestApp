'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Leaf, ArrowLeft } from 'lucide-react' 
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()

  // Mode par défaut : connexion
  const [isLogin, setIsLogin] = useState(true)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    if (isLogin) {
      // Connexion
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setErrors({ api: error.message })
      } else {
        router.refresh()
      }

    } else {
      // Inscription
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas.' })
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: formData.name, role: 'citoyen' },
        },
      })

      if (error) {
        setErrors({ api: error.message })
      } else {
        setErrors({
          api: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.'
        })
      }
    }

    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary-100 p-4 rounded-full">
              <Leaf className="w-8 h-8 text-primary-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-secondary-900 mb-2">
            {isLogin ? 'Bon retour !' : 'Créer un compte'}
          </h1>

          <p className="text-center text-secondary-600 mb-8">
            {isLogin
              ? 'Connectez-vous pour continuer'
              : 'Rejoignez la communauté EcoGest'}
          </p>

          {errors.api && (
            <div
              className={`${
                errors.api.startsWith('Inscription')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              } px-4 py-3 rounded relative mb-4`}
            >
              <span>{errors.api}</span>
            </div>
          )}

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <Input
                label="Nom complet"
                name="name"
                type="text"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="jean.dupont@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {!isLogin && (
              <Input
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isLogin
                  ? 'Connexion...'
                  : 'Création...'
                : isLogin
                  ? 'Se connecter'
                  : 'Créer mon compte'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">ou</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" disabled={isSubmitting}>
            Continuer avec Google
          </Button>

          {/* SWITCH LOGIN / SIGNUP */}
          <p className="mt-6 text-center text-sm text-secondary-600">
            {isLogin ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
