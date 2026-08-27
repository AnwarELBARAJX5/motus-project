from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importation de tes fichiers de routage
from app.api import game
from app.api import auth
from app.core.database import init_database

# Initialisation de la base au démarrage : crée la base 'motus' et les tables si besoin.
init_database()

app = FastAPI(
    title="API Motus",
    description="API pour le jeu Motus - Authentification, Gestion des mots et Scores",
    version="0.1.0",
    # Le sujet exige la doc Swagger sur /swagger (au lieu du /docs par défaut)
    docs_url="/swagger",
)

# Configuration CORS pour autoriser React (port 5173) à requêter l'API (port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(game.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API Motus en ligne"}
