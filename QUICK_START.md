# 🚀 Guide de Démarrage Rapide - EcoGest

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Navigation dans l'Application

### Parcours Complet

1. **Page d'accueil** → `http://localhost:3000/`
   - Cliquez sur "Se Connecter" ou "S'inscrire"

2. **Authentification** → `http://localhost:3000/auth`
   - Testez les deux modes: `?mode=login` et `?mode=signup`
   - Cliquez sur « Connexion Agent/Administrateur » pour révéler le champ `Code d'identification`
   - Utilisez les codes placeholders (`SGDS-GN-AGENT`, `ANASAP-ADMIN`, etc.) pour voir les interfaces pro

3. **Dashboard Citoyen** → `http://localhost:3000/citoyen`
   - Cliquez sur le bouton vert flottant (FAB) en bas à droite

4. **Formulaire de Signalement** → `http://localhost:3000/citoyen/signalement`
   - Testez le curseur d'urgence (Faible/Moyenne/Haute)
   - Cliquez sur la zone photo pour simuler une capture

5. **Dashboard Agent** → `http://localhost:3000/agent`
   - Visualisez la progression de la tournée
   - Explorez la liste des poubelles

6. **Dashboard Admin** → `http://localhost:3000/admin`
   - Interface desktop sombre (gris anthracite/bleu nuit) avec barre latérale
   - Consultez les KPI, graphiques et encarts SGDS-GN / ANASAP humanisés

## 🎨 Personnalisation Rapide

### Changer les couleurs principales

Éditez `tailwind.config.js`:
```js
primary: {
  500: '#22c55e', // Changez cette valeur
}
```

### Ajouter des animations

Les composants utilisent déjà Framer Motion. Ajoutez des animations dans les composants avec:
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

## 🔧 Prochaines Étapes

1. **Intégrer une vraie carte**: Remplacez les placeholders par Google Maps ou Leaflet
2. **Ajouter l'authentification**: Intégrez NextAuth.js
3. **Connecter une API**: Créez les routes API dans `app/api/`
4. **Ajouter une base de données**: Prisma + PostgreSQL recommandé

## 📚 Documentation Complète

Consultez `ARCHITECTURE.md` pour les détails complets de l'architecture.


