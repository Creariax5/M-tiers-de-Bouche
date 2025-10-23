# ========================================
# Auth Service - Dockerfile
# ========================================
FROM node:20-alpine AS base

WORKDIR /app

# Installer curl pour healthcheck
RUN apk add --no-cache curl

# Copier package.json
COPY package*.json ./

# Installer les dépendances (génère package-lock.json dans le conteneur)
RUN npm install --omit=dev

# Copier le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3001

# Démarrer l'application avec migration automatique
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
