# ⚠️ INSTRUCTIONS CRITIQUES - À LIRE À CHAQUE SESSION

## 🐳 RÈGLE #1 : DOCKER TOUJOURS

**JAMAIS d'installations locales**
- ❌ `npm install` en local
- ❌ `npm test` en local  
- ❌ `npm run dev` en local
- ❌ `node src/index.js` en local

---

## ⚖️ RÈGLE #2 : CONFORMITÉ LÉGALE OBLIGATOIRE

**Règlement (UE) n°1169/2011 (INCO) - Étiquetage alimentaire**

### Allergènes (14 ADO)
- ✅ Liste complète : gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits-à-coque, céleri, moutarde, sésame, sulfites, lupin, mollusques
- ✅ Mise en évidence typographique (GRAS, MAJUSCULES)
- ✅ Ordre pondéral décroissant dans liste d'ingrédients

### Déclaration nutritionnelle (pour 100g)
- ✅ Valeur énergétique : **kJ ET kcal** (obligatoire)
  - Formule : `1 kcal = 4.184 kJ`
- ✅ Matières grasses + **dont acides gras saturés**
- ✅ Glucides + **dont sucres**
- ✅ Protéines
- ✅ Sel (arrondi à **2 décimales**)

### Arrondis (Annexe XV INCO)
- Énergie : entier (ex: `295 kcal`)
- Matières grasses, glucides, protéines : 1 décimale (ex: `12.5 g`)
- Sel : **2 décimales** (ex: `0.45 g`)

### ⚠️ Sanctions
- Amende administrative : jusqu'à **300 000€**
- Sanctions pénales : jusqu'à 2 ans prison + 300 000€
- Responsabilité civile en cas d'accident allergique

### 📚 Documentation
- **docs/CONFORMITE_LEGALE.md** : Analyse complète (720 lignes)
- **docs/PLAN_MISE_EN_CONFORMITE.md** : Plan d'action (667 lignes)

**Avant chaque commit** : Vérifier conformité INCO

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

### Erreurs générales
1. ❌ Oublier Docker et lancer npm en local
2. ❌ Créer des fichiers de 500 lignes
3. ❌ Oublier la validation Zod
4. ❌ Ne pas tester avant de commit
5. ❌ Créer un monolithe au lieu de microservices
6. ❌ Utiliser `any` en TypeScript
7. ❌ Copier node_modules dans Docker (utiliser .dockerignore)
8. ❌ Oublier NODE_ENV=test dans les tests
9. ❌ **Bidouiller au lieu d'utiliser les outils correctement**
10. ❌ **Inventer des solutions sans lire la documentation**

### 📋 Erreurs identifiées dans ce projet (à ne JAMAIS refaire)

#### ❌ LECTURE INCOMPLÈTE DE DOCUMENTATION
**Occurrences** : 2 fois détectées
- **Exemple 1** : Migration Prisma `20251023_init` - seulement lu "recipes" dans le fichier, raté que la migration était incomplète (manquait ingredients et recipe_ingredients)
- **Exemple 2** : Sprint 1 marqué "complet" - seulement lu la section backend, raté toute la section frontend (34 points)

**✅ CORRECTIF** :
- **TOUJOURS lire UN FICHIER EN ENTIER** avant d'agir
- Ne jamais se baser sur les 50 premières lignes
- Chercher "et après ?" dans le document
- Vérifier s'il y a d'autres sections/parties

#### ❌ FAUX TOKENS AU LIEU DE VRAIS JWT
**Occurrence** : Tests de pricing initiaux
- Utilisé `Authorization: Bearer test-token-${userId}` au lieu de vrais JWT
- Résultat : 403 Forbidden sur tous les tests

**✅ CORRECTIF** :
```javascript
// ❌ Faux token
.set('Authorization', `Bearer test-token-${testUser.id}`)

// ✅ Vrai JWT
const token = jwt.sign({ userId: testUser.id }, 'test-secret', { expiresIn: '1h' });
.set('Authorization', `Bearer ${token}`)
```

#### ❌ SQL MANUEL AU LIEU DE PRISMA MIGRATE
**Occurrence** : Tentative d'ajouter champs INCO avec ALTER TABLE
- Essayé de modifier la base avec `docker-compose exec postgres psql ...`
- Créé un état incohérent (DB modifiée mais pas le schema Prisma)

**✅ CORRECTIF** :
1. Modifier `prisma/schema.prisma`
2. `npx prisma migrate dev --name description_du_changement`
3. Laisser Prisma générer et appliquer le SQL
4. Ne JAMAIS toucher directement à PostgreSQL

#### ❌ VOLUMES DOCKER NON MONTÉS
**Occurrence** : Migrations créées localement mais invisibles dans container
- Créé migrations dans `./prisma/migrations` localement
- Container ne les voyait pas (volume non monté)

**✅ CORRECTIF** :
- Vérifier `docker-compose.yml` : 
```yaml
volumes:
  - ./backend/services/recipe-service/prisma/migrations:/app/prisma/migrations
```
- Rebuilder le container après ajout de volume

#### ❌ SKIP TDD - IMPLÉMENTATION DIRECTE SANS TESTS
**Occurrence** : US-017 Frontend Auth Pages
- Implémenté directement LoginPage/RegisterPage sans écrire tests d'abord
- Bugs découverts en production : validation "required" + 404 forgot-password
- Violation de la méthodologie RED → GREEN → REFACTOR

**✅ CORRECTIF** :
1. **TOUJOURS** écrire les tests AVANT le code (Phase RED)
2. Lancer les tests (doivent échouer)
3. Implémenter le code minimal (Phase GREEN)
4. Refactoriser si nécessaire
5. **Ne JAMAIS** coder sans tests, même "pour aller vite"

**Pourquoi c'est critique** :
- ✅ Détecte les bugs avant la production
- ✅ Force à penser aux cas limites
- ✅ Documentation vivante du comportement
- ✅ Refactoring en confiance
- ✅ Moins de bugs = gain de temps final

---

**🎯 RÈGLE D'OR** : Si tu as un doute, STOP et lis la documentation complète. Mieux vaut 5 minutes de lecture que 2h de debug.

---

## ⚠️ RÈGLE #3 : FAIRE LES CHOSES PROPREMENT

**TOUJOURS utiliser les outils officiels, JAMAIS bidouiller**

### Exemples de bonnes pratiques

✅ **Prisma migrations** : 
- Utiliser `npx prisma migrate dev --name <description>`
- Laisser Prisma générer les migrations depuis le schema
- Ne JAMAIS modifier manuellement les migrations
- Ne JAMAIS éditer directement la base de données

✅ **Quand un problème survient** :
1. Lire la documentation officielle de l'outil
2. Chercher la solution "propre" recommandée
3. Nettoyer complètement si nécessaire (reset DB, rebuild)
4. Réappliquer avec les outils officiels

❌ **NE JAMAIS** :
- Éditer manuellement le SQL des migrations
- Modifier la base de données avec des requêtes SQL directes
- Créer des fichiers de migration à la main
- Patcher au lieu de reconstruire proprement

### Documentation à TOUJOURS consulter

**AVANT de coder une US** :
1. 📖 **docs/cahier_des_charges.md** → Vision d'ensemble, objectifs métier
2. 📐 **docs/design_system.md** → Standards de code, patterns à suivre
3. ⚖️ **docs/CONFORMITE_LEGALE.md** → Obligations légales INCO (si nutrition/allergènes)
4. 📋 **docs/sprints/sprint-X.md** → Critères d'acceptation de la US
5. 🔧 **docs/technical_specs.md** → Schémas Prisma, structure API

**PENDANT le développement** :
- 🔍 Relire les critères d'acceptation régulièrement
- 🎯 Vérifier qu'on répond bien au besoin métier
- 📚 Consulter la doc officielle des outils (Prisma, Zod, Jest, etc.)

**Pourquoi c'est critique** :
- ✅ Évite de partir dans la mauvaise direction
- ✅ Garantit la conformité légale (300k€ d'amende en jeu)
- ✅ Maintient la cohérence du code
- ✅ Empêche les bugs silencieux
- ✅ Gagne du temps (pas de refactoring massif après)

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
