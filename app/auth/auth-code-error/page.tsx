'use client'

import { useSearchParams } from 'next/navigation'
import { Leaf, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthCodeError() {
  const searchParams = useSearchParams()
  const errorDescription = searchParams.get('error_description') || 'An unknown error occurred.'

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <Leaf className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Erreur d&apos;authentification</h1>
          <p className="text-secondary-600 mb-6">
            Une erreur est survenue lors de la validation de votre compte.
          </p>
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-left text-sm font-mono break-words">
            <strong>Message d&apos;erreur de Supabase:</strong>
            <p className="mt-2">{errorDescription}</p>
          </div>
          <Link
            href="/auth"
            className="mt-8 inline-flex items-center text-primary-500 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retourner à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
