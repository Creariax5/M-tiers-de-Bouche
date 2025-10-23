# 🚀 GitHub Actions CI/CD

Documentation des workflows GitHub Actions pour Métiers de Bouche.

---

## 📋 Workflows Disponibles

### 1. CI Tests (`ci-tests.yml`)

**Déclenchement** :
- Push sur `main`
- Pull Request vers `main`

**Actions** :
- ✅ **Lint** : Vérification du code
- ✅ **Health Check** : Test des services Docker (PostgreSQL, Redis, MinIO)
- ✅ **Database Check** : Vérification des 3 bases de données créées

**Durée estimée** : 2-3 minutes

---

### 2. Docker Build (`docker-build.yml`)

**Déclenchement** :
- Push sur `main`
- Pull Request vers `main`

**Actions** :
- ✅ **Build Matrix** : Build de tous les services en parallèle
  - API Gateway
  - Auth Service
  - Recipe Service
  - Label Service
  - Production Service
  - Frontend
- ✅ **Image Testing** : Vérification que chaque image se build correctement
- ✅ **Cache** : Utilisation du cache GitHub pour accélérer les builds

**Durée estimée** : 3-5 minutes

---

### 3. Deploy (`deploy.yml`)

**Déclenchement** :
- Manuel (workflow_dispatch)
- Push sur `main` (staging automatique)

**Environnements** :
- 🟡 **Staging** : Déploiement automatique sur push
- 🔴 **Production** : Déploiement manuel uniquement

**Actions** :
- 🚀 Déploiement (à configurer selon la plateforme)
- ✅ Health checks post-déploiement
- 📢 Notifications

**Status** : ⚠️ Préparé mais non configuré (nécessite Railway/Render)

---

## 🔧 Configuration Requise

### Secrets GitHub

Aller dans **Settings > Secrets and variables > Actions** et ajouter :

```bash
# Pour Docker Registry (optionnel si utilisation de GHCR)
DOCKER_USERNAME=<votre-username>
DOCKER_PASSWORD=<votre-token>

# Pour Railway (si utilisé)
RAILWAY_TOKEN=<railway-token>

# Pour Render (si utilisé)
RENDER_API_KEY=<render-api-key>

# Variables d'environnement production
POSTGRES_PASSWORD=<prod-password>
JWT_SECRET=<prod-jwt-secret>
STRIPE_SECRET_KEY=<prod-stripe-key>
SENTRY_DSN=<prod-sentry-dsn>
```

### Environments GitHub

Créer les environnements dans **Settings > Environments** :

1. **staging**
   - URL : https://staging.metiers-de-bouche.fr
   - Aucune protection

2. **production**
   - URL : https://metiers-de-bouche.fr
   - Protection : Require reviewers (1 personne minimum)

---

## 📊 Badges

Ajouter dans le README.md :

```markdown
![CI Tests](https://github.com/Creariax5/M-tiers-de-Bouche/workflows/CI%20Tests/badge.svg)
![Docker Build](https://github.com/Creariax5/M-tiers-de-Bouche/workflows/Docker%20Build/badge.svg)
![Deploy](https://github.com/Creariax5/M-tiers-de-Bouche/workflows/Deploy/badge.svg)
```

---

## 🚀 Utilisation

### Tester en local avant de push

```bash
# Vérifier que Docker fonctionne
docker-compose up -d postgres redis minio
docker-compose ps

# Vérifier les builds
docker-compose build

# Cleanup
docker-compose down -v
```

### Déclencher un déploiement manuel

1. Aller dans **Actions**
2. Sélectionner **Deploy**
3. Cliquer sur **Run workflow**
4. Choisir `staging` ou `production`
5. Cliquer sur **Run workflow**

---

## 🔍 Monitoring

### Voir les logs des workflows

```bash
# Via GitHub CLI
gh run list
gh run view <run-id>
gh run view <run-id> --log
```

### Vérifier le statut

```bash
# Via GitHub CLI
gh api repos/Creariax5/M-tiers-de-Bouche/actions/runs
```

---

## 🐛 Dépannage

### Build échoue sur "npm ci"

**Cause** : Pas de `package-lock.json`

**Solution** : Utiliser `npm install` à la place (déjà configuré dans les workflows)

### Tests Docker échouent

**Cause** : Timeouts ou services pas prêts

**Solution** : Augmenter le `sleep` dans le workflow

### Déploiement échoue

**Cause** : Secrets non configurés

**Solution** : Vérifier que tous les secrets sont ajoutés dans GitHub Settings

---

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Railway Deployment](https://docs.railway.app/deploy/deployments)
- [Render Deployment](https://render.com/docs/deploy-from-github)

---

**Dernière mise à jour** : 23 octobre 2025
