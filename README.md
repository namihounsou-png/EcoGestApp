# EcoGest - Application de Gestion Intelligente des Déchets

Application moderne et élégante pour la gestion des déchets avec trois interfaces distinctes : Citoyen (Mobile), Agent (Mobile), et Administrateur (Web/Desktop).

## 🎨 Design System

- **Style**: Chic, Moderne, Minimaliste, Épuré
- **Couleurs Primaires**: Vert Écologique Vif (#22c55e)
- **Couleurs Secondaires**: Gris Anthracite / Bleu Nuit
- **Accentuation**: Orange Vif / Jaune Électrique pour les alertes

## 🚀 Installation

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Parcours Utilisateurs

1. **Landing/Onboarding** - `/`
2. **Connexion/Inscription** - `/auth`
   - Lien discret "Connexion Agent/Administrateur" + champ `Code d'identification`
   - Codes exemples : `SGDS-GN-AGENT`, `SGDS-GN-ADMIN`, `ANASAP-AGENT`, `ANASAP-ADMIN`
3. **Dashboard Citoyen** - `/citoyen`
4. **Signalement Humanisé** - `/citoyen/signalement`
5. **Dashboard Agent** - `/agent`
6. **Dashboard Admin (web/desktop)** - `/admin`

## 🛠️ Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (graphiques)
- Lucide React (icônes)

## 🐦 Variante Flutter (Supabase)

Le dossier `flutter_app/` contient une implémentation Flutter/Supabase respectant les mêmes directives H-UX :

- **Login simplifié** : formulaire Email / Mot de passe, lecture du rôle `citizen | agent | admin` depuis la table `profils` après authentification Supabase.
- **Screens Mobile** : `CitizenDashboard`, `AgentDashboard` avec micro-copie chaleureuse et visuels authentiques.
- **Dashboard Admin** : interface desktop sombre (gris anthracite/bleu nuit) avec graphique moderne (70/80/90 %), KPI SGDS-GN & ANASAP.

### Lancer la version Flutter

```bash
cd flutter_app
flutter pub get
flutter run -d chrome # ou votre device
```

Pensez à renseigner vos clés Supabase dans `lib/main.dart`.*** End Patch```} to=functions.apply_patch


