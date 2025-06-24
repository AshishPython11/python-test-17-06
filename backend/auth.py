from fastapi import Depends ,HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt , JWTError

SECRET_KEY = "Ashish"
ALGORITHM = "HS256"

oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")
hardcoded_users = {
    "admin": "password"
}

def authenticate_user(username:str,password:str):
    return hardcoded_users.get(username)==password

def create_token(username:str):
    return jwt.encode({"sub":username},SECRET_KEY,algorithm=ALGORITHM)

def get_current_user(token:str = Depends(oauth2_schema)):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401,detail="Invalid token")
