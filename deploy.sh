#!/bin/bash

# Script de déploiement manuel sur VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement manuel sur VPS OVH"
echo "=================================="

# Variables
VPS_HOST="vps-63198d57.vps.ovh.net"
VPS_USER="deploy"
PROJECT_DIR="/opt/metiers-de-bouche"

# Vérifier la connexion SSH
echo "🔐 Vérification de la connexion SSH..."
ssh -o ConnectTimeout=5 "$VPS_USER@$VPS_HOST" "echo 'Connexion SSH OK'" || {
    echo "❌ Impossible de se connecter au VPS"
    echo "Vérifiez votre configuration SSH"
    exit 1
}

# Déployer
echo "📦 Déploiement en cours..."
ssh "$VPS_USER@$VPS_HOST" << 'EOF'
    set -e
    
    echo "📁 Navigation vers le dossier projet..."
    cd /opt/metiers-de-bouche || exit 1
    
    echo "📥 Récupération des dernières modifications..."
    git fetch origin
    git reset --hard origin/main
    
    echo "🛑 Arrêt des services..."
    docker compose -f docker-compose.prod.yml --env-file .env.production down
    
    echo "🔨 Rebuild des images..."
    docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache
    
    echo "🚀 Démarrage des services..."
    docker compose -f docker-compose.prod.yml --env-file .env.production up -d
    
    echo "⏳ Attente du démarrage des services..."
    sleep 15
    
    echo "✅ Vérification de l'état des services..."
    docker compose -f docker-compose.prod.yml ps
    
    echo "🧹 Nettoyage des images inutilisées..."
    docker image prune -af
    
    echo "✅ Déploiement terminé avec succès!"
EOF

echo ""
echo "✅ Application déployée sur : http://$VPS_HOST"
echo "📊 Vérifier les logs : ssh $VPS_USER@$VPS_HOST 'cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml logs -f'"
