# ========================================
# Auth Service - Dockerfile
# ========================================
FROM node:20-alpine AS base

WORKDIR /app

# Installer curl pour healthcheck, openssl pour Prisma, et dépendances pour bcrypt
RUN apk add --no-cache curl openssl openssl-dev python3 make g++

# Copier package.json
COPY package*.json ./

# Installer toutes les dépendances (y compris dev pour les tests)
RUN npm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3001

# Démarrer l'application avec génération Prisma et migration automatique
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/index.js"]
