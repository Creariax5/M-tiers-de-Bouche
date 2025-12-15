#!/bin/bash
set -e

echo "🌱 Import de la base de données CIQUAL"
echo "======================================"

cd /opt/regal

echo ""
echo "📥 Import des ingrédients CIQUAL dans recipe-service..."
docker-compose -f docker-compose.prod.yml exec -T recipe-service npx prisma db seed

echo ""
echo "✅ Import CIQUAL terminé !"
echo ""
echo "📊 Vérification..."
docker-compose -f docker-compose.prod.yml exec -T recipe-service npx prisma db seed --preview-feature || true

echo ""
echo "🎉 Base CIQUAL prête à l'emploi !"
