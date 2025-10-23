# ========================================
# Auth Service - Dockerfile
# ========================================
FROM node:20-alpine AS base

WORKDIR /app

# Installer curl pour healthcheck et openssl pour Prisma
RUN apk add --no-cache curl openssl openssl-dev

# Copier package.json
COPY package*.json ./

# Installer toutes les dépendances (y compris dev pour les tests)
RUN npm install

# Copier le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3001

# Démarrer l'application avec migration automatique
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
