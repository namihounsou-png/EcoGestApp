import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcoGest - Gestion Intelligente des Déchets',
  description: 'Application moderne pour la gestion des déchets - Citoyens, Agents et Administrateurs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}



