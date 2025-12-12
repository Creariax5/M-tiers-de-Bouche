#!/bin/bash
set -e

echo "🚀 Configuration automatique du VPS Métiers-de-Bouche"
echo "================================================"

# Mise à jour système
echo ""
echo "📦 Étape 1/9 : Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation Docker
echo ""
echo "🐳 Étape 2/9 : Installation de Docker..."
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérification Docker
echo ""
docker --version
docker compose version

# Installation Git
echo ""
echo "📚 Étape 3/9 : Installation de Git..."
sudo apt install -y git
git --version

# Création utilisateur deploy
echo ""
echo "👤 Étape 4/9 : Création de l'utilisateur deploy..."
if id "deploy" &>/dev/null; then
    echo "L'utilisateur deploy existe déjà"
else
    sudo adduser --disabled-password --gecos "" deploy
    echo "deploy:deploy123" | sudo chpasswd
    sudo usermod -aG sudo deploy
    sudo usermod -aG docker deploy
    echo "Utilisateur deploy créé (mot de passe temporaire: deploy123)"
fi

# Configuration pare-feu
echo ""
echo "🛡️ Étape 5/9 : Configuration du pare-feu..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable
sudo ufw status

echo ""
echo "✅ Configuration de base terminée !"
echo ""
echo "📋 Prochaines étapes MANUELLES :"
echo "1. Cloner votre dépôt GitHub"
echo "2. Créer le fichier .env.production"
echo "3. Lancer docker-compose"
echo ""
echo "💡 Pour continuer, basculez sur l'utilisateur deploy :"
echo "   su - deploy"
