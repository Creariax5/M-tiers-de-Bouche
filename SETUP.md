# 🚀 Setup Instructions

## Quick Start

1. **Copier le fichier d'environnement**
   ```bash
   cp .env.example .env
   ```

2. **Démarrer tous les services**
   ```bash
   docker-compose up -d
   ```

3. **Vérifier que tous les services sont démarrés**
   ```bash
   docker-compose ps
   ```

4. **Accéder aux services**
   - Frontend: http://localhost:80
   - API Gateway: http://localhost:3000
   - MinIO Console: http://localhost:9001 (minioadmin / minioadmin123)

## Services disponibles

| Service | Port | URL |
|---------|------|-----|
| Frontend | 80 | http://localhost:80 |
| API Gateway | 3000 | http://localhost:3000 |
| Auth Service | 3001 | http://localhost:3001 |
| Recipe Service | 3002 | http://localhost:3002 |
| Label Service | 3003 | http://localhost:3003 |
| Production Service | 3004 | http://localhost:3004 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| MinIO API | 9000 | localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f api-gateway

# Redémarrer tous les services
docker-compose restart

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Rebuild les images
docker-compose build

# Rebuild et redémarrer
docker-compose up -d --build
```

## Healthchecks

Chaque service expose un endpoint `/health`:

```bash
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Recipe Service
curl http://localhost:3003/health  # Label Service
curl http://localhost:3004/health  # Production Service
```

## Bases de données

Trois bases PostgreSQL sont créées automatiquement:
- `saas_auth` - Users, Subscriptions, Payments
- `saas_recipes` - Recipes, Ingredients, Nutritional data
- `saas_production` - Production planning

Connexion:
```bash
docker exec -it saas-postgres psql -U postgres -d saas_auth
```

## Troubleshooting

### Les containers ne démarrent pas
```bash
# Voir les logs d'erreur
docker-compose logs

# Vérifier l'état des containers
docker-compose ps
```

### Reconstruire un service spécifique
```bash
docker-compose up -d --build api-gateway
```

### Nettoyer complètement
```bash
docker-compose down -v
docker system prune -a
```
