# ========================================
# Frontend - Dockerfile
# ========================================
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# 1. Copier et builder le Design System
COPY design-system ./design-system
WORKDIR /app/design-system
RUN npm install
# Fix pour rollup sur alpine/linux si nécessaire, sinon npm run build standard
RUN npm run build

# 2. Copier et builder le Frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY --from=build /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Installer curl pour healthcheck
RUN apk add --no-cache curl

# Exposer le port
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
