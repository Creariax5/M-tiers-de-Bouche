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
11. ❌ **Coder de gros morceaux sans tester entre chaque étape**
12. ❌ **Ne pas lire la doc complète avant de commencer**
13. ❌ **Affirmer que tout fonctionne sans vérifier les tests**

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

#### ❌ AFFIRMER QUE TOUT FONCTIONNE SANS VÉRIFIER LES TESTS
**Occurrence** : 6 novembre 2025 - Après refactor PrismaClient
- Agent affirme : "Maintenant 100% des tests passent"
- Réalité : auth-service 35/35 ✅ mais recipe-service 39/88 ❌ (49 échecs)
- Conséquence : Fausse impression de stabilité, bugs non détectés

**Problème** : Assumer sans vérifier
- ❌ "Je pense que ça marche" ≠ "J'ai vérifié que ça marche"
- ❌ Optimisme sans preuve = Dette technique silencieuse
- ❌ Ne pas lancer les tests = Bombe à retardement

**✅ CORRECTIF - TOUJOURS VÉRIFIER** :
```powershell
# Après CHAQUE modification de code
docker-compose build <service>
docker-compose up -d <service>
docker-compose exec <service> npm test

# Lire le résultat complet, pas juste "PASS" ou "FAIL"
# Compter les tests : "Tests: X passed, Y total"
# SI Y - X > 0 → Il y a des échecs à investiguer
```

**Pourquoi c'est critique** :
- ❌ Affirmer sans preuve = Mensonge involontaire
- ❌ Fausse confiance = Bugs en production
- ✅ Vérifier systématiquement = Confiance réelle
- ✅ Lire les résultats = Comprendre l'état réel

**Règle absolue** :
> **"Ne JAMAIS dire que ça marche sans avoir lancé les tests et lu le résultat complet"**

#### ❌ TESTS ISOLÉS SANS VÉRIFICATION DE L'INTÉGRATION RÉELLE
**Occurrence** : US-018 Dashboard (24 octobre 2025)
- Tests unitaires écrits et passants (8/8 ✅) pour `Dashboard.jsx`
- Composant créé avec totalRecipes, topProfitable, etc.
- **MAIS** : `main.jsx` utilisait l'ancien `router.jsx` → `DashboardPage.jsx`
- Résultat : Tests verts ✅ / Production cassée ❌ (ancien composant affiché)
- Bug découvert seulement après deploy Docker et test navigateur

**Problème** : Tests isolés ≠ Tests d'intégration
- Unit tests testaient le bon composant (Dashboard.jsx)
- Mais l'app utilisait un autre composant (DashboardPage.jsx)
- Décalage entre ce qui est testé et ce qui est déployé

**✅ CORRECTIF - TESTS FRONTEND** :
1. ✅ Tests unitaires des composants (behavior, props, hooks)
2. ✅ **Tests d'intégration du router** :
   ```javascript
   // Vérifier que la route charge le BON composant
   describe('Routes Integration', () => {
     it('renders Dashboard on /dashboard route', () => {
       render(<App />);
       // Simuler navigation vers /dashboard
       // Vérifier que le texte unique de Dashboard.jsx apparaît
       expect(screen.getByText('totalRecipes')).toBeInTheDocument();
     });
   });
   ```
3. ✅ **Test E2E après docker-compose up** :
   - Ouvrir navigateur sur http://localhost/dashboard
   - Vérifier visuellement que le bon composant s'affiche
   - Vérifier Network tab que les bons appels API sont faits
4. ✅ **Vérifier le bundle Docker** :
   ```bash
   docker exec saas-frontend sh -c "grep -c 'textUniqueDuComposant' /usr/share/nginx/html/assets/index-*.js"
   # Doit être > 0 si le composant est dans le build
   ```

**Pourquoi c'est critique** :
- ❌ Tests verts ne garantissent PAS que l'app fonctionne
- ❌ Un composant peut être testé mais jamais utilisé
- ❌ Le routing peut pointer vers un vieux composant
- ✅ Toujours vérifier l'intégration complète (router + composant)
- ✅ Toujours tester dans le navigateur après deploy Docker

---

**🎯 RÈGLE D'OR** : Si tu as un doute, STOP et lis la documentation complète. Mieux vaut 5 minutes de lecture que 2h de debug.

---

## ⚠️ RÈGLE #3 : DÉVELOPPEMENT INCRÉMENTAL OBLIGATOIRE

### 🐢 LENTEMENT MAIS SÛREMENT - TOUT PETIT BOUT PAR TOUT PETIT BOUT

**PRINCIPE FONDAMENTAL** : Coder par micro-étapes et TOUT VALIDER avant de passer à la suite.

#### ✅ La bonne approche (OBLIGATOIRE)

**Étape 1 : LIRE ET RÉFLÉCHIR** (30% du temps)
```
1. 📖 Lire la User Story COMPLÈTE dans docs/sprints/sprint-X.md
2. 📖 Lire TOUTE la documentation pertinente :
   - docs/design_system.md (standards)
   - docs/technical_specs.md (schémas Prisma)
   - docs/CONFORMITE_LEGALE.md (si allergènes/nutrition)
3. 🤔 Réfléchir à la structure AVANT de coder :
   - Quels fichiers créer ? (validators, services, controllers, routes)
   - Quelles dépendances entre eux ?
   - Quel ordre d'implémentation ?
4. ✍️ Noter le plan d'action étape par étape
```

**Étape 2 : CODER PAR MICRO-ÉTAPES** (50% du temps)
```
1. Créer UN fichier validator (ex: recipe.validator.js)
   → Tester dans Docker : Importer le fichier, vérifier pas d'erreur
   
2. Créer UN service (ex: recipe.service.js) avec UNE fonction
   → Tester dans Docker : Importer, appeler la fonction, vérifier résultat
   
3. Créer UN controller (ex: recipe.controller.js) avec UNE route
   → Tester dans Docker : Appel API avec curl/PowerShell, vérifier réponse
   
4. Intégrer dans routes (ex: recipe.routes.js)
   → Tester dans Docker : npm test, vérifier que la route répond
   
5. Passer à la fonction suivante
   → Répéter pour chaque endpoint
```

**Étape 3 : VALIDER À CHAQUE MICRO-ÉTAPE** (20% du temps)
```
Après CHAQUE ajout :
✅ docker-compose build recipe-service (si besoin)
✅ docker-compose up -d recipe-service
✅ docker logs saas-recipe-service (vérifier pas d'erreur)
✅ docker-compose exec recipe-service npm test (tests passent ?)
✅ Curl/PowerShell pour tester l'endpoint

SI UN TEST ÉCHOUE → STOP et corriger AVANT de continuer
Ne JAMAIS accumuler des erreurs
```

#### ❌ Les mauvaises approches (INTERDITES)

**❌ Approche "Big Bang"** (INTERDIT)
```
1. Créer tous les fichiers d'un coup (validators, services, controllers, routes)
2. Tout coder en une fois
3. Tester à la fin
4. Découvrir 50 erreurs
5. Passer 3h à débugger
```

**❌ Approche "Optimiste"** (INTERDIT)
```
1. Coder sans tester
2. Assumer que ça marche
3. Commit
4. Découvrir que rien ne fonctionne
5. Git revert
```

**❌ Approche "Cow-boy"** (INTERDIT)
```
1. Coder vite sans réfléchir
2. Ne pas lire la documentation
3. Inventer des solutions
4. Créer un code incompatible avec l'architecture
5. Refactoring massif obligatoire
```

#### 🎯 Exemples concrets de micro-étapes

**Exemple 1 : Créer POST /recipes**

```
✅ Étape 1 : Validator (5 min)
- Créer validators/recipe.validator.js
- Exporter createRecipeSchema (Zod)
- Tester import dans un test isolé
→ Valider : Pas d'erreur ESM

✅ Étape 2 : Service création (10 min)
- Créer services/recipe.service.js
- Fonction createRecipe(userId, data)
- Tester avec prisma.create()
→ Valider : docker-compose exec recipe-service node -e "import('./src/services/recipe.service.js')"

✅ Étape 3 : Controller (5 min)
- Créer controllers/recipe.controller.js
- Fonction create(req, res)
- Appeler le service
→ Valider : Pas d'erreur d'import

✅ Étape 4 : Route (5 min)
- Ajouter dans routes/recipe.routes.js
- router.post('/', auth, validate, controller.create)
→ Valider : docker-compose restart + npm test

✅ Étape 5 : Test d'intégration (10 min)
- Créer tests/recipes.integration.test.js
- Test POST avec vraies données
→ Valider : Le test passe

TOTAL : 35 minutes, 0 erreur, tout fonctionne
```

**Exemple 2 : Ajouter champ nutrition à Ingredient**

```
✅ Étape 1 : Schéma Prisma (3 min)
- Modifier prisma/schema.prisma
- Ajouter proteins Float? dans Ingredient
→ Valider : Pas d'erreur de syntaxe Prisma

✅ Étape 2 : Migration (2 min)
- docker-compose exec recipe-service npx prisma migrate dev --name add_proteins
→ Valider : Migration appliquée sans erreur

✅ Étape 3 : Tester insertion (5 min)
- docker-compose exec recipe-service node
- Créer un ingredient avec proteins
→ Valider : Insertion OK, lecture OK

✅ Étape 4 : Service nutrition (10 min)
- Modifier services/nutrition.service.js
- Ajouter calcul proteins
→ Valider : Fonction retourne bien proteins

✅ Étape 5 : Test (5 min)
- Ajouter test avec proteins
→ Valider : Test passe

TOTAL : 25 minutes, 0 cassure, tout cohérent
```

#### 📏 Règles de taille maximum

**AVANT de commencer à coder** :
- Estimer le nombre de fichiers à créer
- Si > 5 fichiers → Découper la US en sous-tâches
- Implémenter sous-tâche par sous-tâche

**PENDANT le dev** :
- 1 fichier = 1 commit (si indépendant)
- 1 endpoint = 1 commit (validator + service + controller + route + test)
- Ne JAMAIS avoir plus de 3 fichiers modifiés non testés

**Taille maximum par étape** :
- Validator : < 50 lignes
- Service : < 100 lignes (1 fonction = 1 étape)
- Controller : < 30 lignes par fonction
- Routes : < 10 lignes par ajout

#### 🚦 Indicateurs qu'on va trop vite

**🔴 STOP immédiatement si** :
- Tu as 5+ fichiers modifiés non testés
- Tu écris > 100 lignes sans tester
- Tu ne sais plus où tu en es
- Tu as oublié pourquoi tu codes ça
- Les tests échouent et tu ne sais pas pourquoi
- Tu te dis "je testerai après"

**🟡 Ralentir si** :
- Tu hésites sur la structure
- Tu relis le code 3 fois
- Tu cherches comment faire sur Google
→ RETOUR à la documentation

**🟢 Bon rythme si** :
- Chaque micro-étape prend 5-15 minutes
- Les tests passent à chaque étape
- Tu comprends ce que tu fais
- Les commits sont petits et fréquents

#### 📋 Checklist avant CHAQUE micro-étape

**Avant de coder** :
- [ ] J'ai lu la doc complète de cette fonctionnalité
- [ ] Je sais exactement quels fichiers créer/modifier
- [ ] Je connais l'ordre d'implémentation
- [ ] Je sais comment tester cette étape

**Après avoir codé** :
- [ ] Le fichier fait < 200 lignes
- [ ] Pas d'erreur ESM à l'import
- [ ] docker-compose build OK
- [ ] docker logs → Pas d'erreur au démarrage
- [ ] npm test → Tests de cette étape passent
- [ ] Curl/PowerShell → Endpoint répond correctement

**Si UNE case n'est pas cochée → STOP et corriger**

#### 💡 Avantages du développement incrémental

✅ **Zéro dette technique** : Code propre dès le départ  
✅ **Zéro bug silencieux** : Testé à chaque étape  
✅ **Zéro confusion** : On sait toujours où on en est  
✅ **Zéro perte de temps** : Pas de debug massif  
✅ **Commits propres** : Historique git compréhensible  
✅ **Revue de code facile** : Petits changements clairs  
✅ **Rollback possible** : Chaque commit est stable  

#### ⏱️ Temps réel vs temps perçu

```
❌ Approche rapide (Big Bang) :
- Dev : 1h (sensation d'avancer vite)
- Debug : 3h (50 erreurs à corriger)
- TOTAL : 4h + frustration

✅ Approche incrémentale (Micro-étapes) :
- Dev : 2h (sensation de lenteur)
- Debug : 0h (aucun bug)
- TOTAL : 2h + confiance

GAIN : 50% de temps + 0 stress
```

### 🎯 RÈGLE ABSOLUE

**"Tout petit bout par tout petit bout, et tout doit marcher avant de passer à la suite"**

Si tu ne peux pas tester une étape → Elle est trop grosse → La découper en 2

---

## ⚠️ RÈGLE #4 : FAIRE LES CHOSES PROPREMENT

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

- [ ] � **J'ai lu TOUTE la documentation pertinente AVANT de coder**
- [ ] 🤔 **J'ai réfléchi à la structure AVANT d'écrire du code**
- [ ] 🐢 **J'ai codé par micro-étapes (< 100 lignes par étape)**
- [ ] ✅ **CHAQUE micro-étape a été testée et fonctionne**
- [ ] �🐳 Tout testé dans Docker (pas en local)
- [ ] 🧪 Tests passent : `docker-compose exec <service> npm test`
- [ ] 📏 Fichiers < 200 lignes, fonctions < 30 lignes
- [ ] ✅ Validation Zod sur tous les inputs
- [ ] 📦 Pas de node_modules ou .env committé
- [ ] 📖 User Story marquée DONE si terminée
- [ ] 🔄 Build Docker OK : `docker-compose build <service>`
- [ ] 🎯 **Je peux expliquer POURQUOI j'ai codé ça comme ça**

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

1. **STOP et RESPIRER** 🧘
2. **Lire cette doc en entier** (oui, TOUTE)
3. **Lire la doc de la US dans docs/sprints/sprint-X.md** (TOUTE)
4. **Vérifier docs/design_system.md** pour standards
5. **Regarder auth-service** (exemple complet et fonctionnel)
6. **Revenir en arrière** : Git reset au dernier état stable
7. **Recommencer en micro-étapes** : 1 fichier → test → 1 fichier → test
8. **Checker les logs Docker** : `docker logs <service>`
9. **Tester dans Docker** pas en local !

### 🎯 Questions à se poser quand bloqué

- ❓ Ai-je lu TOUTE la documentation avant de coder ?
- ❓ Ai-je réfléchi à la structure globale ?
- ❓ Ai-je testé la dernière micro-étape ?
- ❓ Mes fichiers font-ils < 200 lignes ?
- ❓ Ai-je accumulé trop de changements non testés ?
- ❓ Est-ce que je comprends vraiment ce que je fais ?

**Si réponse "non" à UNE question → Revenir en arrière et recommencer proprement**

---

**TL;DR** : 
- 🐳 Docker TOUJOURS
- 📖 Lire AVANT de coder
- 🤔 Réfléchir à la structure
- 🐢 Coder tout petit bout par tout petit bout
- ✅ TOUT tester avant de passer à la suite
- 🧪 TDD - Microservices - Code simple < 200 lignes
