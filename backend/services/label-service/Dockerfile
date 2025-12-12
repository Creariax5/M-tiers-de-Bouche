# ========================================
# Label Service - Dockerfile
# ========================================
FROM node:20-alpine AS base

# Installer Chromium pour Puppeteer
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Configurer Puppeteer pour utiliser le Chromium système
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Installer curl pour healthcheck et openssl pour Prisma
RUN apk add --no-cache curl openssl

# Copier package.json
COPY package*.json ./

# Copier le dossier prisma pour la génération du client
COPY prisma ./prisma/

# Installer les dépendances (incluant devDependencies pour les tests)
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3003

# Démarrer l'application
CMD ["node", "src/index.js"]
