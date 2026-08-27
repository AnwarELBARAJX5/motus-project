# Motus

Implémentation web du jeu **Motus** : deviner un mot mystère de 5 à 10 lettres en 6 tentatives.
Chaque proposition est évaluée lettre par lettre selon le code couleur de Motus.

## Sommaire

- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [URLs utiles](#urls-utiles)
- [Règles du jeu](#règles-du-jeu)
- [Structure du projet](#structure-du-projet)

## Aperçu

- Authentification (inscription / connexion) par **JWT** — le jeu n'est jouable qu'une fois connecté.
- Génération des mots via l'**API open source** [trouve-mot.fr](https://trouve-mot.fr).
- **Niveaux de difficulté** basés sur la longueur du mot (5 à 10 lettres).
- **Classement** des joueurs (meilleur score par joueur).
- Documentation **Swagger** de l'API.
- Entièrement **dockerisé** (front + back + base de données).

## Architecture

| Couche | Technologie | Port |
|--------|-------------|------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS | `5173` |
| Backend | FastAPI (Python 3.11) + SQLAlchemy | `3000` |
| Base de données | Microsoft SQL Server 2022 | `1433` |

**Flux principal :** le frontend appelle l'API FastAPI (JWT en en-tête `Authorization`).
Le backend interroge l'API externe de mots, nettoie le mot (suppression des accents), le stocke,
et le renvoie. Les scores et le classement sont persistés dans SQL Server.

Au démarrage, le backend **crée automatiquement la base `motus` et ses tables** si elles n'existent
pas (voir `backend/app/core/database.py`), en attendant que SQL Server soit prêt.
Le script SQL équivalent est aussi disponible dans `database/init.sql`.

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose.

## Configuration

Copier le fichier d'exemple et l'adapter si besoin :

```bash
cp .env.example .env
```

Variables disponibles :

| Variable | Rôle |
|----------|------|
| `DB_PASSWORD` | Mot de passe de l'utilisateur `sa` de SQL Server |
| `SECRET_KEY` | Clé secrète de signature des tokens JWT |
| `VITE_API_URL` | URL de l'API vue par le navigateur (`http://localhost:3000`) |

## Lancement

```bash
docker compose up --build
```

Aucune étape manuelle supplémentaire : la base et les tables sont créées automatiquement.

## URLs utiles

| Service | URL |
|---------|-----|
| Jeu (frontend) | http://localhost:5173 |
| API (backend) | http://localhost:3000 |
| Documentation Swagger | http://localhost:3000/swagger |

## Règles du jeu

- Mot mystère de 5 à 10 lettres (selon la difficulté choisie), **6 tentatives**.
- La **première lettre** est affichée par défaut.
- Après chaque proposition, chaque lettre est colorée :

| Indice | Signification |
|--------|---------------|
| 🟥 Carré rouge | Lettre bien placée |
| 🟡 Rond jaune | Lettre présente mais mal placée |
| 🟦 Fond bleu | Lettre absente du mot |

- Le score dépend du nombre de tentatives : `(6 − tentatives + 1) × 100`.

## Structure du projet

```
motus-project/
├── backend/            # API FastAPI
│   └── app/
│       ├── api/        # Routes (auth, game) + dépendances
│       ├── core/       # Config base de données, sécurité (JWT, hash)
│       ├── models/     # Modèles SQLAlchemy (Users, Scores, Mots)
│       └── main.py     # Point d'entrée + init base + Swagger
├── frontend/           # Application React (Vite)
│   └── src/
│       ├── components/ # Grid, Cell, AuthForm, Game, Leaderboard
│       └── services/   # Hooks (useAuth, useMotusGame) + logique de jeu
├── database/
│   └── init.sql        # Script SQL d'initialisation (référence)
├── docker-compose.yml
└── .env.example
```
