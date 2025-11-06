# ========================================
# Recipe Service - Dockerfile
# ========================================
FROM node:20-alpine

WORKDIR /app

# Installer curl et openssl pour healthcheck et Prisma
RUN apk add --no-cache curl openssl openssl-dev

# Copier package.json
COPY package*.json ./

# Installer toutes les dépendances (y compris dev pour Prisma)
RUN npm install

# Copier le code source
COPY . .

# Rendre le script d'entrée exécutable et corriger les fins de ligne
RUN chmod +x docker-entrypoint.sh && \
    sed -i 's/\r$//' docker-entrypoint.sh

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3002

# Démarrer l'application avec migrations
CMD ["/bin/sh", "-c", "./docker-entrypoint.sh"]
