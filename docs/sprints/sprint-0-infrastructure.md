# 🚀 SPRINT 0 : Infrastructure & Setup Docker
**Durée** : 1 semaine (Semaine 1)  
**Dates** : À définir  
**Sprint Goal** : Mettre en place l'environnement Docker complet et opérationnel

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 43 (40 + 3 Sentry)
- **Points réalisés** : -
- **Vélocité** : -

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, nous avons un environnement Docker complet avec tous les microservices qui démarrent sans erreur via `docker-compose up -d`"**

### Critères de succès
- ✅ Tous les conteneurs démarrent (frontend, api-gateway, auth, recipe, label, production, postgres, redis, minio)
- ✅ Healthchecks verts sur tous les services
- ✅ Chaque service peut communiquer avec les autres
- ✅ Bases de données créées et accessibles
- ✅ Documentation complète du setup

---

## 📝 USER STORIES DU SPRINT

### US-001 : Setup Docker Compose
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux un environnement Docker complet afin de développer localement avec tous les services.

**Critères d'acceptation** :
- [ ] docker-compose.yml contient tous les services (frontend, api-gateway, auth, recipe, label, production)
- [ ] Réseau Docker `saas-network` configuré
- [ ] Volumes persistants pour PostgreSQL, Redis, MinIO
- [ ] `docker-compose up -d` démarre tous les services sans erreur
- [ ] Healthchecks sur tous les services fonctionnels

**Tâches** :
- [ ] Créer structure de dossiers (frontend/, backend/api-gateway/, backend/services/)
- [ ] Créer docker-compose.yml avec network et volumes
- [ ] Ajouter 6 services applicatifs (frontend, api-gateway, 4 microservices)
- [ ] Configurer ports et depends_on
- [ ] Tester démarrage complet

---

### US-002 : Configuration PostgreSQL Multi-DB
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux plusieurs bases de données PostgreSQL isolées afin que chaque microservice ait sa propre DB.

**Critères d'acceptation** :
- [ ] Script `init-databases.sh` crée 3 bases : saas_auth, saas_recipes, saas_production
- [ ] Chaque service peut se connecter à sa DB
- [ ] Isolation complète entre les bases

**Tâches** :
- [ ] Créer script `init-databases.sh`
- [ ] Ajouter container postgres dans docker-compose.yml
- [ ] Volume mount du script
- [ ] Tester création des 3 bases
- [ ] Documenter connexion depuis services

---

### US-003 : Setup Redis Cache
**Points** : 3 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux un service Redis afin de cacher les calculs nutritionnels et gérer les sessions.

**Critères d'acceptation** :
- [ ] Container Redis démarré
- [ ] Connexion depuis services backend OK
- [ ] Persistance activée (appendonly yes)

**Tâches** :
- [ ] Ajouter service redis dans docker-compose.yml
- [ ] Volume redis-data pour persistance
- [ ] Command: `redis-server --appendonly yes`
- [ ] Healthcheck avec `redis-cli ping`
- [ ] Tester connexion depuis api-gateway

---

### US-004 : Setup MinIO (S3 local)
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux un stockage S3-compatible afin de stocker photos et PDFs localement.

**Critères d'acceptation** :
- [ ] MinIO démarré avec console accessible (localhost:9001)
- [ ] Buckets créés : recipes-photos, labels-pdf
- [ ] Upload/download fonctionnel

**Tâches** :
- [ ] Ajouter service minio dans docker-compose.yml
- [ ] Ports : 9000 (API), 9001 (Console)
- [ ] Variables : MINIO_ROOT_USER, MINIO_ROOT_PASSWORD
- [ ] Volume minio-data
- [ ] Accéder à console http://localhost:9001
- [ ] Créer les 2 buckets manuellement ou via script

---

### US-005 : Setup CI/CD GitHub Actions
**Points** : 8 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant que développeur, je veux un pipeline CI/CD afin d'automatiser les tests et déploiements.

**Critères d'acceptation** :
- [ ] Workflow test.yml : lance tests sur PR
- [ ] Workflow docker-build.yml : build images Docker
- [ ] Workflow deploy.yml : déploie en staging/prod

**Tâches** :
- [ ] Créer workflows GitHub Actions (test, build, deploy)
- [ ] Configurer secrets GitHub
- [ ] Tester sur une PR

---

### US-006 : Variables d'environnement
**Points** : 2 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux un fichier .env.example afin de configurer facilement l'environnement.

**Critères d'acceptation** :
- [ ] .env.example contient toutes les variables nécessaires
- [ ] Documentation des variables dans le fichier
- [ ] .env ajouté au .gitignore

**Tâches** :
- [ ] Créer `.env.example` à la racine
- [ ] Documenter chaque variable
- [ ] Ajouter `.env` dans `.gitignore`
- [ ] README : instructions pour copier .env.example

---

### US-007 : API Gateway - Routing de base
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux un API Gateway centralisé afin de router les requêtes vers les microservices.

**Critères d'acceptation** :
- [ ] Service api-gateway démarre sur port 3000
- [ ] Routing vers auth-service, recipe-service, label-service, production-service
- [ ] CORS configuré (origin strict, pas de wildcard)
- [ ] Rate limiting global (100 req/15min par IP)
- [ ] Helmet pour headers de sécurité (CSP, HSTS, etc.)
- [ ] Healthcheck endpoint /health

**Tâches** :
- [ ] Créer `backend/api-gateway/` avec TypeScript
- [ ] Installer express, cors, helmet, express-rate-limit, http-proxy-middleware
- [ ] Middleware CORS + Rate Limiting + Helmet
- [ ] Routes proxy vers 4 microservices
- [ ] Sentry pour monitoring erreurs
- [ ] Dockerfile + tests routage

---

### US-008 : Setup Sentry & Monitoring
**Points** : 3 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que développeur, je veux monitorer les erreurs afin de les corriger rapidement.

**Critères d'acceptation** :
- [ ] Sentry configuré dans api-gateway
- [ ] Capture des erreurs 500
- [ ] Pas de données sensibles dans les logs (passwords, tokens)
- [ ] Alertes email sur erreurs critiques

**Tâches** :
- [ ] Créer compte Sentry (gratuit)
- [ ] Installer @sentry/node
- [ ] Middleware error handler avec Sentry
- [ ] Tests

---

## 🐛 BUGS IDENTIFIÉS

_Aucun bug pour l'instant (Sprint 0)_

---

## 📈 DAILY STANDUP NOTES

### Jour 1 (Lundi)
**Ce qui a été fait** :
- 

**Ce qui sera fait aujourd'hui** :
- 

**Blocages** :
- 

---

### Jour 2 (Mardi)
**Ce qui a été fait** :
- 

**Ce qui sera fait aujourd'hui** :
- 

**Blocages** :
- 

---

### Jour 3 (Mercredi)
**Ce qui a été fait** :
- 

**Ce qui sera fait aujourd'hui** :
- 

**Blocages** :
- 

---

### Jour 4 (Jeudi)
**Ce qui a été fait** :
- 

**Ce qui sera fait aujourd'hui** :
- 

**Blocages** :
- 

---

### Jour 5 (Vendredi)
**Ce qui a été fait** :
- 

**Ce qui sera fait aujourd'hui** :
- Sprint Review + Retrospective

**Blocages** :
- 

---

## 📊 SPRINT REVIEW

**Date** : -  
**Participants** : -

### Démo
- [ ] docker-compose up -d fonctionne
- [ ] Tous les services en green
- [ ] Accès aux interfaces : Frontend (http://localhost:80), API Gateway (http://localhost:3000), MinIO Console (http://localhost:9001)
- [ ] Tests de connectivité entre services

### Feedback
-

---

## 🔄 SPRINT RETROSPECTIVE

**Date** : -  
**Participants** : -

### ✅ What went well?
-

### ❌ What could be improved?
-

### 💡 Action items pour le prochain sprint
- [ ] 

---

## 📚 DOCUMENTATION CRÉÉE

- [ ] README.md principal avec instructions setup
- [ ] docker-compose.yml commenté
- [ ] .env.example documenté
- [ ] Architecture diagram (à jour)

---

## 🎯 DEFINITION OF DONE

Pour ce sprint, une US est "Done" si :
- ✅ Code écrit et testé
- ✅ Dockerfile créé et fonctionnel
- ✅ Service démarre dans docker-compose
- ✅ Documentation mise à jour
- ✅ Code review (si équipe >1)

---

**Status** : 🟡 IN PROGRESS  
**Dernière mise à jour** : 22 octobre 2025
