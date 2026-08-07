import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, Mot

router = APIRouter(prefix="/api/game", tags=["Jeu"])

# Utilisation de l'API open source 'trouve-mot.fr' pour la génération de mots français
EXTERNAL_API_URL = "https://trouve-mot.fr/api/size"

@router.get("/generate-word/{size}")
async def generate_word(size: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Génère un mot d'une longueur spécifique (difficulté) via une API open source.
    L'accès est restreint aux utilisateurs connectés.
    """
    if size < 5 or size > 10:
        raise HTTPException(status_code=400, detail="La longueur du mot doit être entre 5 et 10 lettres")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{EXTERNAL_API_URL}/{size}")
            response.raise_for_status()
            data = response.json()
            word = data[0]["name"].upper()

            # Sauvegarde optionnelle dans la base de données locale
            new_mot = Mot(word=word, longueur=size, difficulte=size)
            db.add(new_mot)
            db.commit()

            return {"word": word, "length": size}

        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="API de génération de mots indisponible")

@router.post("/submit-score")
def submit_score(score: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.models import Score
    new_score = Score(login_id=current_user.id, score=score)
    db.add(new_score)
    db.commit()
    return {"message": "Score enregistré"}