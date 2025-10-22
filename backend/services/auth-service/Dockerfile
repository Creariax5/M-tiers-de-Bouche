# ========================================
# Auth Service - Dockerfile
# ========================================
FROM node:20-alpine AS base

WORKDIR /app

# Installer curl pour healthcheck
RUN apk add --no-cache curl

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3001

# Démarrer l'application
CMD ["node", "src/index.js"]
