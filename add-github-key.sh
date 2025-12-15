#!/bin/bash
# Script pour ajouter la clé publique GitHub Actions

echo "🔑 Ajout de la clé publique GitHub Actions..."

# Créer le répertoire .ssh si nécessaire
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Ajouter la clé publique
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE30cGY0K9NanRe/GCAXg9sVn716rFXJnmRQi1/mw/gi github-actions-deploy" >> ~/.ssh/authorized_keys

# Fixer les permissions
chmod 600 ~/.ssh/authorized_keys

echo "✅ Clé publique ajoutée avec succès !"
echo ""
echo "📋 Prochaine étape : Configurer les secrets GitHub"
