#!/bin/bash
set -e

echo "🔑 Configuration GitHub Actions - Génération des clés SSH"
echo "=========================================================="

# Générer la clé SSH
echo ""
echo "📝 Génération de la clé SSH..."
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions -N ""

# Ajouter la clé publique aux authorized_keys
echo ""
echo "✅ Ajout de la clé aux authorized_keys..."
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

echo ""
echo "=========================================================="
echo "📋 CLÉ PRIVÉE (à copier dans GitHub Secret VPS_SSH_KEY) :"
echo "=========================================================="
cat ~/.ssh/github_actions
echo ""
echo "=========================================================="
echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📌 Prochaines étapes :"
echo "1. Copiez la clé privée ci-dessus (TOUT depuis -----BEGIN jusqu'à -----END)"
echo "2. Allez sur GitHub → Settings → Secrets → Actions"
echo "3. Créez 3 secrets :"
echo "   - VPS_HOST = 217.182.171.135"
echo "   - VPS_USER = deploy"
echo "   - VPS_SSH_KEY = [la clé privée complète]"
echo ""
