import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _master_url() -> str:
    """URL de connexion vers la base système 'master' (pour créer la base applicative)."""
    return DATABASE_URL.replace("/motus?", "/master?", 1)


def init_database(max_retries: int = 30, delay: float = 2.0) -> None:
    """
    Initialise la base au démarrage, pour un `docker compose up` clé en main :
      1. attend que SQL Server accepte les connexions (le conteneur db met du temps à démarrer),
      2. crée la base 'motus' si elle n'existe pas,
      3. crée les tables à partir des modèles SQLAlchemy.
    """
    # AUTOCOMMIT est nécessaire : CREATE DATABASE ne peut pas s'exécuter dans une transaction.
    master_engine = create_engine(_master_url(), isolation_level="AUTOCOMMIT")

    last_error = None
    for _ in range(max_retries):
        try:
            with master_engine.connect() as conn:
                conn.execute(text("IF DB_ID('motus') IS NULL CREATE DATABASE motus;"))
            last_error = None
            break
        except Exception as e:  # SQL Server pas encore prêt -> on réessaie
            last_error = e
            time.sleep(delay)

    if last_error is not None:
        raise last_error

    # Import tardif pour enregistrer Users/Scores/Mots sur Base.metadata sans import circulaire.
    from app.models import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
