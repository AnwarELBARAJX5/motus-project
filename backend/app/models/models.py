from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    pseudo = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    numero_secu = Column(String(15), nullable=True)

    scores = relationship("Score", back_populates="joueur")

class Score(Base):
    __tablename__ = "Scores"

    id = Column(Integer, primary_key=True, index=True)
    login_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    date_partie = Column(DateTime, server_default=text("GETDATE()"))

    joueur = relationship("User", back_populates="scores")

class Mot(Base):
    __tablename__ = "Mots"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(50), nullable=False)
    longueur = Column(Integer, nullable=False)
    difficulte = Column(Integer, nullable=False)