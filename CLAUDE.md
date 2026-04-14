# Ma Veille

Application de veille personnelle pour sauvegarder et organiser des ressources web.

## Stack technique

| Couche       | Technologie                          |
|--------------|--------------------------------------|
| Frontend     | HTML, CSS, JavaScript vanilla (ES6+) |
| Base de données | Supabase (PostgreSQL)             |
| Déploiement  | Vercel                               |
| API externe  | Microlink (aperçu automatique de liens) |

## Structure du projet

```
ma-veille/
├── index.html      — Structure de la page (header, grille, modal)
├── style.css       — Styles avec variables CSS, responsive, animations
├── app.js          — Logique : rendu, filtres, recherche, modal, Microlink
├── CLAUDE.md       — Ce fichier : guide du projet pour l'IA
├── .env.example    — Variables d'environnement à copier en .env
├── .gitignore      — Fichiers à exclure du dépôt
└── README.md       — Instructions de démarrage
```

## Fonctionnalités

- **Sauvegarde de liens** — Ajout via un modal avec préremplissage automatique (Microlink)
- **Organisation par catégories** — Articles, Outils, Vidéos, Autres
- **Recherche en temps réel** — Filtre sur titre, notes et domaine
- **Notes personnelles** — Champ texte libre sur chaque ressource
- **Suppression** — Icône poubelle apparaissant au survol de chaque carte

## Architecture de app.js

Le fichier est organisé en sections délimitées par des commentaires :

1. **DONNÉES DE DÉMONSTRATION** — `MOCK_DATA` avec 5 ressources réelles
2. **SUPABASE** — Stubs `fetchLinks`, `insertLink`, `deleteLink` avec TODO commentés
3. **ÉTAT LOCAL** — Variables `localLinks`, `activeCategory`, `searchQuery`
4. **RENDU** — `createCardElement`, `renderGrid`, `filterLinks`
5. **FILTRES & RECHERCHE** — `initFilters`, `initSearch`
6. **SUPPRESSION** — Délégation d'événement sur la grille
7. **MODAL** — Ouverture, fermeture, reset
8. **MICROLINK** — `fetchLinkInfo`, `initFetchInfo`
9. **FORMULAIRE** — `initFormSubmit`, validation
10. **UTILITAIRES** — `showToast`, `escapeHtml`

## Conventions

- Interface entièrement en **français**
- Toutes les interactions base de données utilisent des **fonctions `async`**
- Les clés API ne doivent **jamais** être dans le code source — utiliser `.env`
- Aucune bibliothèque externe : HTML + CSS + JavaScript vanilla uniquement
- Sécurité : les contenus utilisateur sont échappés via `escapeHtml()` avant injection dans le DOM

## Roadmap pédagogique

| Module | Objectif |
|--------|----------|
| **Module 1 — Supabase** | Créer la table `links`, remplacer les stubs dans `app.js` |
| **Module 2 — Auth** | Ajouter la connexion utilisateur avec `supabase.auth` |
| **Module 3 — Déploiement** | Pousser sur GitHub, connecter à Vercel, configurer les variables d'env |

## Mon domaine de veille

<!-- À compléter par le participant : décris ici tes sujets de veille,
     tes catégories habituelles, et l'usage que tu feras de cet outil -->
