# ⚠️ INSTRUCTIONS CRITIQUES - À LIRE À CHAQUE SESSION

## 🐳 RÈGLE #1 : DOCKER TOUJOURS

**JAMAIS d'installations locales**
- ❌ `npm install` en local
- ❌ `npm test` en local  
- ❌ `npm run dev` en local
- ❌ `node src/index.js` en local

**TOUJOURS via Docker**
- ✅ `docker-compose build <service>`
- ✅ `docker-compose up -d <service>`
- ✅ `docker-compose exec <service> npm test`
- ✅ `docker-compose exec <service> npm run <script>`
- ✅ `docker logs <container-name>`

### Tests
```powershell
# ✅ Bon
docker-compose exec recipe-service npm test

# ❌ Interdit
cd backend/services/recipe-service ; npm test
```

---

## 📐 ARCHITECTURE : MICROSERVICES

**Séparation stricte des services**
- Chaque service = 1 conteneur Docker isolé
- Chaque service = son propre package.json
- Chaque service = sa propre base de données (schemas séparés)
- Communication inter-services via API REST interne

**Services actuels**
```
frontend          → React (port 80/443)
api-gateway       → Routage + Auth (port 3000)
auth-service      → Users + JWT (port 3001) - saas_auth DB
recipe-service    → Recettes + Calculs (port 3002) - saas_recipes DB
label-service     → PDF INCO (port 3003)
production-service → Planning (port 3004) - saas_production DB
postgres          → PostgreSQL 16 (3 databases)
redis             → Cache
minio             → Storage S3
```

---

## 🧪 MÉTHODOLOGIE : TDD

**RED → GREEN → REFACTOR**

1. **RED** : Écrire tests d'intégration (doivent échouer)
2. **GREEN** : Implémenter le code minimal pour passer les tests
3. **REFACTOR** : Nettoyer si nécessaire

**Structure de test**
```javascript
// tests/*.integration.test.js
- describe() par endpoint
- beforeEach() pour setup DB
- afterEach() pour cleanup
- afterAll() pour disconnect Prisma
```

**Configuration Jest**
- `--forceExit` dans package.json (pas --detectOpenHandles)
- `NODE_ENV=test` dans tests/setup.js
- Export `default app` dans src/index.js pour tests

---

## 📁 OÙ TROUVER L'INFO

### Documentation projet
- **docs/design_system.md** → Règles de code, standards
- **docs/cahier_des_charges.md** → Specs fonctionnelles
- **docs/technical_specs.md** → Schémas Prisma, APIs
- **docs/plan_projet_dev.md** → Architecture technique
- **docs/sprints/sprint-X.md** → User stories du sprint

### Sprints
- **Sprint 0** : Infrastructure Docker (DONE)
- **Sprint 1** : Auth + Recipes (EN COURS)
  - US-008 : Registration (DONE - 8pts)
  - US-009 : Login (DONE - 5pts)
  - US-009-bis : Reset Password (DONE - 5pts)
  - US-010 : JWT Middleware (DONE - 3pts)
  - US-011 : User Profile (DONE - 5pts)
  - **US-012 : Recipe CRUD (EN COURS - 13pts)** 👈 CURRENT
  - US-013 : Nutrition Calc (8pts)
  - US-014 : Allergen Detection (5pts)
  - US-015 : Pricing Calc (8pts)
  - US-016 : Sub-recipes (13pts)

### Services existants
- **auth-service** : 35/35 tests ✅ (validators, middleware, reset-password, profile)
- **recipe-service** : Infrastructure prête, tests en cours 🔄

---

## 🎯 WORKFLOW SPRINT

1. **Lire la User Story** dans docs/sprints/sprint-X.md
2. **Phase RED** : Créer tests d'intégration dans Docker
   ```powershell
   docker-compose exec recipe-service npm test
   ```
3. **Phase GREEN** : Implémenter (validators → services → controllers → routes)
4. **Valider** : Tous les tests passent dans Docker
5. **Commit + Push** : 
   ```powershell
   git add .
   git commit -m "feat(recipes): US-012 CRUD endpoints TDD"
   git push origin sprint-1-auth-recipes
   ```
6. **Mettre à jour** docs/sprints/sprint-X.md (marquer DONE)

---

## 💻 STANDARDS DE CODE

### Fichiers
- < 200 lignes par fichier
- 1 responsabilité par fichier
- Nom explicite (pas d'abréviations)

### Fonctions
- < 30 lignes par fonction
- 1 seule tâche
- Nom en verbe d'action

### Validation
- **Zod** partout pour validation
- `.passthrough()` pour flexibilité
- Schémas séparés dans `src/validators/`

### Tests
- Tests d'intégration avec vraie DB
- Pas de mocks complexes
- Coverage > 60% pragmatique

### ESM
- `type: "module"` dans package.json
- `import/export` (pas require)
- Extensions `.js` dans imports

---

## 🚨 ERREURS FRÉQUENTES À ÉVITER

1. ❌ Oublier Docker et lancer npm en local
2. ❌ Créer des fichiers de 500 lignes
3. ❌ Oublier la validation Zod
4. ❌ Ne pas tester avant de commit
5. ❌ Créer un monolithe au lieu de microservices
6. ❌ Utiliser `any` en TypeScript
7. ❌ Copier node_modules dans Docker (utiliser .dockerignore)
8. ❌ Oublier NODE_ENV=test dans les tests

---

## 📝 CHECKLIST AVANT COMMIT

- [ ] 🐳 Tout testé dans Docker (pas en local)
- [ ] 🧪 Tests passent : `docker-compose exec <service> npm test`
- [ ] 📏 Fichiers < 200 lignes, fonctions < 30 lignes
- [ ] ✅ Validation Zod sur tous les inputs
- [ ] 📦 Pas de node_modules ou .env committé
- [ ] 📖 User Story marquée DONE si terminée
- [ ] 🔄 Build Docker OK : `docker-compose build <service>`

---

## 🎨 COMMANDES DOCKER ESSENTIELLES

```powershell
# Build un service
docker-compose build recipe-service

# Démarrer un service
docker-compose up -d recipe-service

# Voir les logs
docker logs saas-recipe-service
docker logs -f saas-recipe-service  # Follow mode

# Exécuter une commande dans le container
docker-compose exec recipe-service npm test
docker-compose exec recipe-service npx prisma migrate dev
docker-compose exec recipe-service sh  # Shell interactif

# Redémarrer après changement de code
docker-compose restart recipe-service

# Rebuild complet (après changements Dockerfile/package.json)
docker-compose build recipe-service
docker-compose up -d recipe-service

# Voir les containers actifs
docker-compose ps

# Arrêter tout
docker-compose down

# Nettoyer volumes (ATTENTION: efface les données)
docker-compose down -v
```

---

## 🔥 SI BLOQUÉ

1. **Lire cette doc en entier**
2. **Vérifier docs/design_system.md** pour standards
3. **Regarder auth-service** (exemple complet et fonctionnel)
4. **Checker les logs Docker** : `docker logs <service>`
5. **Tester dans Docker** pas en local !

---

**TL;DR** : 🐳 Docker TOUJOURS - TDD - Microservices - Code simple < 200 lignes
