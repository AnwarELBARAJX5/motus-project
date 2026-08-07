from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentification"])

class UserCreate(BaseModel):
    pseudo: str
    password: str
    numero_secu: str = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.pseudo == user.pseudo).first():
        raise HTTPException(status_code=400, detail="Ce pseudo est déjà utilisé")

    new_user = User(
        pseudo=user.pseudo,
        password=get_password_hash(user.password),
        numero_secu=user.numero_secu
    )
    db.add(new_user)
    db.commit()
    return {"message": "Compte créé avec succès"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.pseudo == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects"
        )

    access_token = create_access_token(data={"sub": user.pseudo})
    return {"access_token": access_token, "token_type": "bearer"}