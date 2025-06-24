# For Backend

## Install requiements.txt
```python
pip install -r requirements.txt
```

## run migrations
```python
alembic upgrade head
```
## run backend project
```python
uvicorn -m main:app --reload
```  
