# Architecture EcoGest - Documentation

## 📁 Structure du Projet

```
EcoGest App/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Écran 1: Landing/Onboarding
│   ├── auth/
│   │   └── page.tsx              # Écran 2: Connexion/Inscription
│   ├── citoyen/
│   │   ├── page.tsx              # Écran 3: Accueil/Carte Citoyen
│   │   └── signalement/
│   │       └── page.tsx          # Écran 4: Formulaire de Signalement
│   ├── agent/
│   │   └── page.tsx              # Écran 5: Dashboard Agent
│   ├── admin/
│   │   └── page.tsx              # Écran 6: Dashboard Administrateur
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Styles globaux
├── components/
│   └── ui/                       # Composants UI réutilisables
│       ├── Button.tsx            # Bouton avec variants
│       ├── Card.tsx              # Carte avec ombre
│       └── Input.tsx             # Input avec label et erreur
├── tailwind.config.js            # Configuration Tailwind (couleurs, thème)
├── package.json                  # Dépendances
└── tsconfig.json                 # Configuration TypeScript
├── flutter_app/                  # Variante Flutter/Supabase
│   ├── lib/
│   │   ├── main.dart
│   │   ├── router/app_router.dart
│   │   ├── services/auth_service.dart
│   │   ├── theme/ (app_colors.dart, app_theme.dart)
│   │   └── screens/ (login, citizen, agent, admin)
│   └── pubspec.yaml
```

## 🎨 Design System

### Couleurs

- **Primaire (Vert Écologique)**: `#22c55e` - Actions principales, CTA, identité de marque
- **Secondaire (Gris Anthracite)**: `#334155` - Textes, fonds Admin
- **Accentuation (Orange)**: `#fb923c` - Alertes moyennes
- **Warning (Jaune)**: `#facc15` - Alertes critiques (90%+)

### Typographie

- **Police**: Inter, Poppins (sans-serif moderne)
- **Hiérarchie**: 
  - Titres: `text-3xl`, `font-bold`
  - Sous-titres: `text-xl`, `font-semibold`
  - Corps: `text-base`, `font-medium`

### Composants Clés

1. **Button**: Variants (primary, secondary, outline, ghost) avec animations Framer Motion
2. **Card**: Ombres subtiles (`shadow-card`), bordures arrondies
3. **Input**: Label, validation, états d'erreur

## 📱 Parcours Utilisateurs

### 1. Landing/Onboarding (`/`)
- Slides d'introduction avec navigation par points
- Présentation des 3 rôles (Citoyen, Agent, Admin)
- CTA "Se Connecter" / "S'Inscrire"
- Design épuré avec gradient vert

### 2. Connexion/Inscription (`/auth`)
- Toggle entre login/signup via query param `?mode=login|signup`
- Formulaire minimaliste avec micro-copie chaleureuse
- Connexion sociale (Google)
- Lien discret "Connexion Agent/Administrateur"
  - Affiche le champ **Code d'identification de l'organisation**
  - Codes placeholders : `SGDS-GN-AGENT`, `SGDS-GN-ADMIN`, `ANASAP-AGENT`, `ANASAP-ADMIN`
- Sans code validé ➝ parcours citoyen, avec code ➝ redirection vers l'espace pro

### 3. Dashboard Citoyen (`/citoyen`)
- **Indicateur de Propreté Locale**: Carte avec pourcentage
- **Carte Interactive**: Placeholder pour intégration Maps
- **FAB (Floating Action Button)**: Bouton vert vif pour signalement
- Statistiques rapides et signalements récents

### 4. Formulaire de Signalement (`/citoyen/signalement`)
- **Photo**: Capture avec placeholder
- **Géolocalisation**: Détection automatique
- **Curseur d'Urgence**: Composant UX clé avec changement de couleur progressif
  - Faible: Vert (`primary-500`)
  - Moyenne: Orange (`accent-400`)
  - Haute: Rouge (`red-500`)
- **Confirmation**: Écran de succès avec message chaleureux

### 5. Dashboard Agent (`/agent`)
- **Panneau de Progression**: `5/12 poubelles collectées` avec barre
- **Carte avec Itinéraire**: Marqueurs numérotés pour poubelles
- **Liste des Poubelles**: Statut (pending/completed), priorité, niveau de remplissage
- Actions rapides (GPS, Pause)

### 6. Dashboard Administrateur (`/admin`)
- **Flutter Admin** : interface web orientée bureaux avec side-nav fixe, cartes KPI, graphiques FLChart.
- Interface Web/Desktop distincte (fond Gris Anthracite / Bleu Nuit, navigation latérale persistante)
- **Grille de KPI** humanisée : état SGDS-GN & ANASAP, tonalité analytique
- **Graphique de Répartition** (Fonctionnalité 1) :
  - Pie chart moderne avec couleurs critiques (Vert 70-79%, Orange 80-89%, Rouge 90%+)
- **Graphique Hebdomadaire**: Bar chart signalements vs résolus
- **Signalements Récents**: Liste avec badges d'urgence et micro-feedback positif
- **Voix des organisations**: Encarts SGDS-GN / ANASAP

## 🎯 Directives H-UX (Humanisation)

### Micro-copie
- Messages positifs: "Mission accomplie !", "Signalement bien reçu !"
- Ton encourageant et collaboratif
- Éviter le jargon technique

### Feedback
- Messages de confirmation chaleureux avec emojis
- Messages d'erreur empathiques
- Animations douces (Framer Motion)

### Visuels
- Placeholders remplacés par des photos humaines (Unsplash) : citoyens, agents, communautés en action
- Emojis utilisés comme soutien émotionnel, pas comme principal visuel

## 🚀 Prochaines Étapes

1. **Intégration Cartes**:
   - Google Maps API ou Leaflet pour les cartes interactives
   - Géolocalisation réelle
   - Itinéraires optimisés pour agents

2. **Backend**:
   - API REST ou GraphQL
   - Authentification (NextAuth.js)
   - Base de données (PostgreSQL, MongoDB)

3. **Fonctionnalités Avancées**:
   - Notifications push
   - Upload de photos réelles
   - Système de points/récompenses pour citoyens
   - Analytics avancés pour admin

4. **Mobile**:
   - PWA (Progressive Web App)
   - Ou migration vers React Native/Flutter si besoin natif

## 📦 Dépendances Principales

- **Next.js 14**: Framework React avec App Router
- **TypeScript**: Typage statique
- **Tailwind CSS**: Styling utility-first
- **Framer Motion**: Animations fluides
- **Recharts**: Graphiques (Pie, Bar charts)
- **Lucide React**: Icônes modernes
- **Flutter**: Variante mobile multiplateforme
  - `supabase_flutter` pour l'auth & la lecture du rôle
  - `go_router` pour la navigation déclarative
  - `fl_chart` pour les graphiques admin
  - `google_fonts` / theming personnalisé

## 🎨 Personnalisation

Pour modifier les couleurs, éditez `tailwind.config.js`:
```js
colors: {
  primary: { /* Vert écologique */ },
  secondary: { /* Gris anthracite */ },
  accent: { /* Orange vif */ },
  warning: { /* Jaune électrique */ }
}
```

Pour ajouter des composants, créez-les dans `components/ui/` en suivant les patterns existants.


