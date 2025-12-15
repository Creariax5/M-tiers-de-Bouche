# ========================================
# Frontend - Dockerfile
# ========================================
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer les dépendances (génère package-lock.json dans le conteneur)
RUN npm install

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Installer curl pour healthcheck
RUN apk add --no-cache curl

# Exposer le port
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
