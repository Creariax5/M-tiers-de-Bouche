# ========================================
# Production Service - Dockerfile
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

# Exposer le port
EXPOSE 3004

# Démarrer l'application
CMD ["node", "src/index.js"]
