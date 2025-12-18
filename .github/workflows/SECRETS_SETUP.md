# 🔐 Configuration des Secrets GitHub Actions

## Secrets Requis

### 1. Déploiement VPS (OBLIGATOIRE)

```bash
# Dans GitHub : Settings > Secrets and variables > Actions > New repository secret

VPS_HOST=51.210.xxx.xxx
VPS_USER=root
VPS_SSH_KEY=<contenu de votre clé privée SSH>
```

**Comment générer la clé SSH** :
```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions@metiers-de-bouche" -f ~/.ssh/github_actions

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_actions.pub root@51.210.xxx.xxx

# Copier le contenu de la clé PRIVÉE dans GitHub Secret VPS_SSH_KEY
cat ~/.ssh/github_actions
```

---

### 2. Notifications Discord (OPTIONNEL mais recommandé)

```bash
DISCORD_WEBHOOK=https://discord.com/api/webhooks/XXXXXXX/YYYYYYYY
```

**Comment créer un webhook Discord** :
1. Aller dans votre serveur Discord
2. Paramètres du salon > Intégrations > Webhooks
3. Créer un webhook "GitHub Actions"
4. Copier l'URL du webhook
5. Ajouter dans GitHub Secrets

**Test du webhook** :
```bash
curl -X POST "$DISCORD_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "✅ Test webhook GitHub Actions",
    "embeds": [{
      "title": "Deploy Test",
      "description": "Ceci est un test",
      "color": 65280
    }]
  }'
```

---

### 3. Coverage Reports (OPTIONNEL)

```bash
CODECOV_TOKEN=<token depuis codecov.io>
```

**Setup Codecov** :
1. Aller sur [codecov.io](https://codecov.io)
2. Se connecter avec GitHub
3. Ajouter le repository `Métiers-de-Bouche`
4. Copier le token
5. Ajouter dans GitHub Secrets

---

### 4. Container Registry (OPTIONNEL - déjà configuré avec GHCR)

Si vous voulez utiliser Docker Hub au lieu de GHCR :

```bash
DOCKER_USERNAME=votre-username-dockerhub
DOCKER_PASSWORD=<token Docker Hub>
```

**Note** : Les workflows utilisent GHCR (GitHub Container Registry) par défaut, qui utilise automatiquement `GITHUB_TOKEN`. Pas besoin de configuration supplémentaire.

---

## Variables d'Environnement (Environments)

### Setup des Environments

1. Aller dans **Settings > Environments**
2. Créer 2 environnements :

#### Environment: `staging`

**Configuration** :
- Deployment branches: `develop`, `main`
- Pas de protection spécifique
- URL: `http://51.210.xxx.xxx` (votre VPS staging)

**Secrets** (override des secrets généraux) :
```bash
VPS_HOST=51.210.xxx.xxx  # IP staging si différente
# Utilise les secrets généraux par défaut
```

#### Environment: `production`

**Configuration** :
- Deployment branches: `main` uniquement
- **Protection rules** :
  - ✅ Required reviewers: 1 personne minimum
  - ✅ Wait timer: 5 minutes (temps de réflexion)
- URL: `https://metiers-de-bouche.fr` (votre domaine prod)

**Secrets** (override) :
```bash
VPS_HOST=production.server.ip  # Si différent de staging
VPS_USER=deploy  # User dédié en prod
# Les autres secrets sont hérités
```

---

## Vérification des Secrets

### Script de validation

Créer un workflow temporaire pour vérifier :

```yaml
# .github/workflows/test-secrets.yml
name: Test Secrets

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Check VPS connection
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            echo "✅ SSH connection successful"
            whoami
            pwd
      
      - name: Test Discord webhook
        if: secrets.DISCORD_WEBHOOK != ''
        run: |
          curl -X POST "${{ secrets.DISCORD_WEBHOOK }}" \
            -H "Content-Type: application/json" \
            -d '{"content": "✅ Discord webhook test successful"}'
```

**Usage** :
1. Push ce fichier
2. Aller dans Actions > Test Secrets > Run workflow
3. Vérifier que les 2 jobs passent
4. **SUPPRIMER** ce workflow après validation (sécurité)

---

## Sécurité des Secrets

### ✅ Best Practices

1. **Rotation régulière** : Changer les secrets tous les 3 mois
2. **Principe du moindre privilège** : Créer un user `deploy` sur le VPS, pas `root`
3. **Audit logs** : Monitorer l'utilisation dans Settings > Logs
4. **Secrets environment-specific** : Différents secrets staging/prod
5. **Pas de secrets dans le code** : Toujours utiliser `${{ secrets.XXX }}`

### ❌ À NE JAMAIS FAIRE

```yaml
# ❌ MAUVAIS - Secret exposé dans les logs
- run: echo "Mon secret: ${{ secrets.VPS_SSH_KEY }}"

# ❌ MAUVAIS - Secret dans un fichier committé
- run: echo "${{ secrets.VPS_SSH_KEY }}" > key.pem
  # puis git add key.pem

# ❌ MAUVAIS - Secret en clair dans le workflow
env:
  VPS_PASSWORD: "mon-mot-de-passe-en-clair"
```

### ✅ Bonnes Pratiques

```yaml
# ✅ BON - Utilisation sécurisée
- uses: appleboy/ssh-action@v1.0.0
  with:
    key: ${{ secrets.VPS_SSH_KEY }}
    # Le secret n'apparaît jamais dans les logs

# ✅ BON - Masquage automatique
- run: |
    echo "::add-mask::${{ secrets.VPS_SSH_KEY }}"
    # Maintenant même si affiché, il sera masqué ***

# ✅ BON - Fichier temporaire sécurisé
- run: |
    echo "${{ secrets.VPS_SSH_KEY }}" > /tmp/key.pem
    chmod 600 /tmp/key.pem
    ssh -i /tmp/key.pem user@host
    rm -f /tmp/key.pem
```

---

## User Dédié Déploiement (Recommandé)

Au lieu d'utiliser `root`, créer un user `deploy` :

```bash
# Sur le VPS
sudo adduser deploy
sudo usermod -aG docker deploy

# Créer dossier SSH
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# Copier la clé publique GitHub Actions
echo "ssh-ed25519 AAAAC3... github-actions@metiers-de-bouche" | \
  sudo tee -a /home/deploy/.ssh/authorized_keys

sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh

# Donner accès au projet
sudo chown -R deploy:deploy /opt/regal

# Tester la connexion
ssh -i ~/.ssh/github_actions deploy@51.210.xxx.xxx
```

Puis modifier le secret GitHub :
```bash
VPS_USER=deploy  # Au lieu de root
```

---

## Secrets par Service (Advanced)

Pour des microservices avec secrets spécifiques :

```yaml
# Dans le workflow
- name: Deploy recipe-service
  env:
    DATABASE_URL: ${{ secrets.RECIPE_DB_URL }}
    REDIS_URL: ${{ secrets.REDIS_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
  run: |
    # Les secrets sont disponibles uniquement dans ce step
```

---

## Checklist Setup

- [ ] VPS_HOST configuré
- [ ] VPS_USER configuré
- [ ] VPS_SSH_KEY configuré (clé privée complète)
- [ ] Test connexion SSH réussie
- [ ] DISCORD_WEBHOOK configuré (optionnel)
- [ ] Test webhook Discord OK
- [ ] Environment `staging` créé
- [ ] Environment `production` créé avec protection
- [ ] Protection rules configurées (reviewers)
- [ ] User `deploy` créé sur VPS (recommandé)
- [ ] Permissions Docker pour user `deploy`
- [ ] Test workflow `test-secrets.yml` passé
- [ ] Workflow de test supprimé
- [ ] Documentation équipe mise à jour

---

## Troubleshooting

### Erreur: "Host key verification failed"

**Solution** :
```yaml
- uses: appleboy/ssh-action@v1.0.0
  with:
    key: ${{ secrets.VPS_SSH_KEY }}
    # Ajouter cette ligne:
    script_stop: false
```

Ou ajouter l'host key dans `known_hosts` :
```bash
ssh-keyscan -H 51.210.xxx.xxx >> ~/.ssh/known_hosts
```

### Erreur: "Permission denied (publickey)"

**Causes possibles** :
1. Clé privée mal copiée (manque `-----BEGIN/END-----`)
2. Clé publique pas dans `authorized_keys` sur le VPS
3. Permissions incorrectes sur `.ssh/` (doit être 700)

**Solution** :
```bash
# Sur le VPS, vérifier:
ls -la ~/.ssh/
# Doit afficher:
# drwx------ .ssh
# -rw------- authorized_keys

# Corriger si besoin:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Erreur: Discord webhook 404

**Solution** :
Vérifier que l'URL complète est copiée :
```
https://discord.com/api/webhooks/123456789/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-
```

Ne PAS oublier la partie après le dernier `/`.

---

## Ressources

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Action Documentation](https://github.com/appleboy/ssh-action)
- [Discord Webhooks Guide](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
- [Codecov Documentation](https://docs.codecov.com/docs)
