import httpx
import unicodedata
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, Mot, Score

router = APIRouter(prefix="/api/game", tags=["Jeu"])

EXTERNAL_API_URL = "https://trouve-mot.fr/api/size"


@router.get("/generate-word/{size}")
async def generate_word(size: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Génère un mot, supprime les accents, et l'enregistre en base.
    """
    if size < 5 or size > 10:
        raise HTTPException(status_code=400, detail="La longueur du mot doit être entre 5 et 10 lettres")

    async with httpx.AsyncClient() as client:
        try:
            # Injection du User-Agent pour éviter le blocage 403
            response = await client.get(f"{EXTERNAL_API_URL}/{size}", headers={'User-Agent': 'Mozilla/5.0'})
            response.raise_for_status()
            data = response.json()
            raw_word = data[0]["name"].upper()

            # Nettoyage strict des accents
            clean_word = ''.join(
                c for c in unicodedata.normalize('NFD', raw_word)
                if unicodedata.category(c) != 'Mn'
            )

            # Sauvegarde locale
            new_mot = Mot(word=clean_word, longueur=size, difficulte=size)
            db.add(new_mot)
            db.commit()

            return {"word": clean_word, "length": size}

        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="API de génération de mots indisponible")


@router.post("/submit-score")
def submit_score(score: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_score = Score(login_id=current_user.id, score=score)
    db.add(new_score)
    db.commit()
    return {"message": "Score enregistré"}


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Génère le classement des joueurs.
    """
    query = text("""
        WITH MaxScores AS (
            SELECT login_id, MAX(score) as best_score
            FROM Scores
            GROUP BY login_id
        )
        SELECT
            u.pseudo,
            ms.best_score,
            DENSE_RANK() OVER (ORDER BY ms.best_score DESC) as rank
        FROM MaxScores ms
        JOIN Users u ON ms.login_id = u.id
        ORDER BY rank ASC;
    """)

    result = db.execute(query).fetchall()

    return [
        {
            "rank": row.rank,
            "pseudo": row.pseudo,
            "score": row.best_score
        }
        for row in result
    ]