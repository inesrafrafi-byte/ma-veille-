# Ma Veille

Application de veille personnelle pour sauvegarder et organiser vos ressources web.
Projet pédagogique — HTML + CSS + JavaScript vanilla, connexion Supabase à venir.

## Démarrage rapide

### 1. Cloner le dépôt

```bash
git clone <url-du-repo> ma-veille
cd ma-veille
```

### 2. Ouvrir dans VS Code

```bash
code .
```

### 3. Lancer avec Live Server

1. Installez l'extension **Live Server** (Ritwick Dey) si ce n'est pas déjà fait.
2. Clic droit sur `index.html` → **Open with Live Server**
3. L'application s'ouvre sur `http://127.0.0.1:5500` avec les données de démonstration.

> Pas besoin de serveur Node, de build, ni de configuration. Tout fonctionne nativement.

## Variables d'environnement (Module Supabase)

```bash
cp .env.example .env
# Éditez .env et renseignez vos clés Supabase
```

Les clés ne sont **jamais** utilisées directement dans le code source — elles seront
injectées lors du module Supabase.
