# Éventis — Docker

## Prérequis
Docker Desktop installé et lancé.

## Lancer

**Développement**
```bash
docker compose -f docker-compose.dev.yml up --build
```

**Production**
```bash
docker compose -f docker-compose.prod.yml up --build
```

## Arrêter

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.prod.yml down
```

## URLs

Frontend — http://localhost:5173  
Backend — http://localhost:8000/api  
phpMyAdmin — http://localhost:8080 (dev uniquement)