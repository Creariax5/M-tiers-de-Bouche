#!/bin/bash
set -e

echo "🚀 Finalisation de la configuration du VPS"
echo "=========================================="

# Migrations Prisma
echo ""
echo "📊 Exécution des migrations Prisma..."
echo "Auth service..."
docker-compose -f docker-compose.prod.yml exec -T auth-service npx prisma migrate deploy

echo "Recipe service..."
docker-compose -f docker-compose.prod.yml exec -T recipe-service npx prisma migrate deploy

echo "Label service..."
docker-compose -f docker-compose.prod.yml exec -T label-service npx prisma migrate deploy

# Configuration pare-feu
echo ""
echo "🛡️ Configuration du pare-feu..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable
sudo ufw status

# Vérification finale
echo ""
echo "✅ Vérification des services..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Votre application est accessible sur :"
echo "   http://217.182.171.135"
echo ""
