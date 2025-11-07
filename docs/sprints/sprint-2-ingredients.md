# 🚀 SPRINT 2 : Ingredient Database & Frontend UX
**Durée** : 2 semaines (Semaines 4-5)  
**Dates** : À définir  
**Sprint Goal** : Base de données Ciqual importée et recherche d'ingrédients fonctionnelle

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 34 (inchangé, renforcement US existantes)
- **Points réalisés** : -
- **Vélocité** : -

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, un artisan peut rechercher des ingrédients dans la base Ciqual et créer des ingrédients personnalisés"**

### Critères de succès
- ✅ Base Ciqual importée (3000+ aliments)
- ✅ Recherche rapide d'ingrédients (<200ms)
- ✅ Création ingrédients personnalisés
- ✅ Frontend : autocomplete performant

---

## 📝 USER STORIES DU SPRINT

### US-021 : Import base Ciqual
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : IA | **Status** : 🔄 IN PROGRESS

**Description** :  
En tant que système, je veux importer automatiquement la base Ciqual afin de proposer 3000+ ingrédients avec leurs valeurs nutritionnelles.

**Critères d'acceptation** :
- [x] Script d'import CSV Ciqual
- [x] 3000+ aliments importés (2197 importés, 988 ignorés données incomplètes)
- [x] Données : nom, calories, protéines, glucides, lipides, sel, allergènes
- [x] Index de recherche créé

**Tâches** :
- [x] ~~Migration BaseIngredient/CustomIngredient terminée~~
- [x] ~~Télécharger CSV Ciqual officiel (https://ciqual.anses.fr/)~~
- [x] ~~Parser et nettoyer données (XML latin1, 57 Mo compo)~~
- [x] ~~Mapping catégories Ciqual → IngredientCategory enum~~
- [x] ~~Script Prisma seed avec valeurs nutritionnelles~~
- [x] ~~Import en base PostgreSQL (2197 aliments)~~
- [x] ~~Créer index full-text search~~
- [ ] Tests d'intégration

**Progression** : 10/13 points (77%)  
**Démarré** : 7 novembre 2025  
**Terminé (partiel)** : 7 novembre 2025 (import OK, tests en attente)

---

### US-022 : Recherche d'ingrédients
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux rechercher rapidement un ingrédient afin de l'ajouter à ma recette.

**Critères d'acceptation** :
- [ ] GET /ingredients?search=farine
- [ ] Recherche full-text (nom + synonymes)
- [ ] Résultats <200ms
- [ ] Limite 20 résultats
- [ ] Tri par pertinence
- [ ] Affichage catégorie + fournisseur

**Tâches** :
- [ ] Route GET /ingredients avec query search
- [ ] Implémentation full-text search PostgreSQL
- [ ] Pagination + tri
- [ ] Tests performance

---

### US-023 : Détail ingrédient
**Points** : 3 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir les détails d'un ingrédient afin de connaître ses valeurs nutritionnelles.

**Critères d'acceptation** :
- [ ] GET /ingredients/:id
- [ ] Affichage complet : nom, valeurs nutritionnelles, allergènes, prix moyen

**Tâches** :
- [ ] Route GET /ingredients/:id
- [ ] Tests

---

### US-024 : Création ingrédient personnalisé
**Points** : 5 | **Priorité** : � MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux créer mes ingrédients personnalisés afin d'avoir mon catalogue spécifique.

**Critères d'acceptation** :
- [ ] POST /ingredients/custom
- [ ] Champs : nom, prix, unité, fournisseur, valeurs nutritionnelles, allergènes
- [ ] Champs traçabilité : lot, DLC, DLUO
- [ ] Catégorisation (farines, sucres, etc.)
- [ ] Validation des données
- [ ] Lié à mon userId

**Tâches** :
- [ ] Route POST /ingredients/custom
- [ ] Schema CustomIngredient avec fournisseur + traçabilité
- [ ] Validation Zod
- [ ] Tests

---

### US-025 : Modification ingrédient personnalisé
**Points** : 3 | **Priorité** : � MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux modifier mes ingrédients personnalisés afin de corriger les données.

**Critères d'acceptation** :
- [ ] PUT /ingredients/custom/:id
- [ ] DELETE /ingredients/custom/:id
- [ ] Impossible de modifier ingrédients Ciqual
- [ ] Alertes si DLC/DLUO dépassée

**Tâches** :
- [ ] Routes PUT/DELETE custom ingredients
- [ ] Vérification userId
- [ ] Système d'alertes DLC
- [ ] Tests

---

### US-026 : Frontend - Autocomplete ingrédients
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux un autocomplete fluide afin de trouver mes ingrédients rapidement.

**Critères d'acceptation** :
- [ ] Composant Autocomplete avec debounce 300ms
- [ ] Recherche après 2 caractères
- [ ] Affichage nom + catégorie
- [ ] Sélection au clic ou Enter
- [ ] Loading state

**Tâches** :
- [ ] Créer composant IngredientAutocomplete
- [ ] Debounce API call
- [ ] Loading + empty state
- [ ] Tests

---

### US-027 : Frontend - Gestion ingrédients personnalisés
**Points** : 5 | **Priorité** : � MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux gérer mes ingrédients personnalisés afin de maintenir mon catalogue.

**Critères d'acceptation** :
- [ ] Page /ingredients/custom
- [ ] Liste de mes ingrédients avec fournisseur
- [ ] Formulaire création/modification (nom, prix, fournisseur, lot, DLC, catégorie)
- [ ] Validation côté client
- [ ] Badges d'alerte pour DLC proches

**Tâches** :
- [ ] Créer page CustomIngredients
- [ ] Formulaire complet avec tous les champs
- [ ] Système d'alertes visuelles DLC
- [ ] Tests

---

## 🐛 BUGS IDENTIFIÉS

_À remplir pendant le sprint_

---

## 📈 DAILY STANDUP NOTES

### Jour 1-10
_À remplir quotidiennement_

---

## 📊 SPRINT REVIEW

**Date** : -  
**Participants** : -

### Démo
- [ ] Recherche ingrédient Ciqual
- [ ] Création ingrédient personnalisé
- [ ] Autocomplete dans formulaire recette

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

### 💡 Action items
- [ ] 

---

## 🎯 DEFINITION OF DONE

- ✅ Code testé (>80% coverage)
- ✅ Code review approuvée
- ✅ Documentation API
- ✅ Tests manuels OK
- ✅ Déployé en staging

---

**Status** : � IN PROGRESS  
**Dernière mise à jour** : 7 novembre 2025

---

## 📅 SUIVI DU SPRINT

### Semaine 1 (7-13 novembre 2025)
**Focus** : US-021 Import Ciqual + US-022 Recherche

**7 novembre** :
- ✅ Migration Sprint 1.5 terminée (114/114 tests)
- ✅ Scripts migration supprimés
- ✅ **US-021 avancée (10/13 points, 77%)** : Import base Ciqual
  - Phase 1 : ✅ Téléchargement XML Ciqual officiel (5 fichiers, 100 Mo)
  - Phase 2 : ✅ Analyse structure + mapping catégories
  - Phase 3 : ✅ Script import-ciqual.js créé (XML parser)
  - Phase 4 : ✅ **2197 aliments importés** (988 ignorés, données incomplètes)
  - Phase 5 : ✅ Index full-text search créé
  - Phase 6 : ⏳ Tests d'intégration (3 points restants)
  
**Statistiques import** :
- FARINES: 73 aliments
- CHOCOLAT_CACAO: 237 aliments  
- EPICES: 33 aliments
- AUTRE: 1854 aliments

**Commande** : `docker-compose exec recipe-service node prisma/import-ciqual.js`
