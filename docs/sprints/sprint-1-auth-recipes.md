# 🚀 SPRINT 1 : Auth Service & Recipe Service Base
**Durée** : 2 semaines (Semaines 2-3)  
**Dates** : À définir  
**Sprint Goal** : Créer l'authentification JWT et le CRUD des recettes avec calculs automatiques

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 73 (68 + 5 reset password)
- **Points réalisés** : 16/73 (22%)
- **Vélocité estimée** : 43 points/semaine (basé sur Sprint 0)
- **Statut** : 🟢 EN COURS

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, un artisan peut s'inscrire, se connecter, créer une recette et voir automatiquement les allergènes, valeurs nutritionnelles et coût de revient"**

### Critères de succès
- ✅ Inscription et connexion fonctionnelles avec JWT
- ✅ CRUD recettes complet via API
- ✅ Calculs automatiques (allergènes, nutrition, coûts) fonctionnels
- ✅ Frontend : pages auth + liste recettes + formulaire création
- ✅ Tests unitaires sur services de calculs

---

## 📝 USER STORIES DU SPRINT

### US-008 : Auth Service - Inscription utilisateur
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux créer un compte afin d'utiliser l'application.

**Critères d'acceptation** :
- [x] POST /auth/register crée un utilisateur
- [x] Password hashé avec bcrypt
- [x] Validation email unique
- [ ] Email de bienvenue envoyé (Resend) - Non implémenté
- [x] Essai gratuit 14 jours activé

**Tâches** :
- [x] Créer auth-service avec Prisma
- [x] Implémenter route POST /auth/register
- [x] Hashage password + validation Zod
- [ ] Envoi email bienvenue
- [x] Tests unitaires (validateurs)

---

### US-009 : Auth Service - Connexion JWT
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant qu'artisan, je veux me connecter afin d'accéder à mes recettes.

**Critères d'acceptation** :
- [x] POST /auth/login retourne JWT token (7 jours)
- [x] Validation email/password
- [x] Token contient userId + email + plan
- [ ] Rate limiting : 5 tentatives / 15 min - Global rate limiting en place (100/15min)
- [ ] httpOnly cookies (production) ou localStorage (dev) - À implémenter frontend

**Tâches** :
- [x] Implémenter route POST /auth/login
- [x] Vérification password + génération JWT
- [ ] Rate limiting spécifique login
- [x] Gestion erreurs (credentials invalides)
- [x] Tests unitaires (validateurs)

---

### US-009-bis : Auth Service - Reset password
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux réinitialiser mon mot de passe si je l'ai oublié.

**Critères d'acceptation** :
- [ ] POST /auth/forgot-password envoie email avec lien
- [ ] Lien valide 1h avec token unique
- [ ] POST /auth/reset-password change le password
- [ ] Rate limiting : 3 tentatives / heure

**Tâches** :
- [ ] Token unique dans DB (ResetToken table)
- [ ] Email avec lien (Resend)
- [ ] Route reset-password avec validation
- [ ] Tests

---

### US-010 : Auth Service - Middleware JWT
**Points** : 3 | **Priorité** : 🔴 MUST | **Assigné à** : - | **Status** : ✅ DONE

**Description** :  
En tant que développeur, je veux un middleware de vérification JWT afin de sécuriser toutes les routes API.

**Critères d'acceptation** :
- [x] Middleware vérifie le JWT
- [x] Retourne 401 si token manquant
- [x] Retourne 403 si token invalide
- [x] Injecte req.user pour routes suivantes

**Tâches** :
- [x] Créer middleware auth
- [x] Vérification JWT + gestion erreurs
- [x] Tests d'intégration (5 tests, TDD)

---

### US-011 : Auth Service - Profil utilisateur
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir et modifier mon profil afin de mettre à jour mes informations.

**Critères d'acceptation** :
- [ ] GET /auth/me retourne profil utilisateur
- [ ] PUT /auth/me met à jour le profil
- [ ] Upload logo entreprise vers MinIO

**Tâches** :
- [ ] Implémenter routes GET/PUT /auth/me
- [ ] Upload logo vers MinIO
- [ ] Tests

---

### US-012 : Recipe Service - CRUD Recettes
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux créer, lire, modifier, supprimer mes recettes afin de gérer mon catalogue.

**Critères d'acceptation** :
- [ ] POST /recipes crée une recette
- [ ] GET /recipes liste mes recettes (pagination)
- [ ] GET /recipes/:id détail d'une recette
- [ ] PUT /recipes/:id modifie une recette
- [ ] DELETE /recipes/:id supprime une recette
- [ ] Filtres par catégorie
- [ ] Recherche par nom
- [ ] Champs complets : nom, catégorie, portions, prepTime, cookTime, instructions, conservationConditions, shelfLife

**Tâches** :
- [ ] Créer recipe-service avec Prisma
- [ ] Schema Recipe avec tous les champs (temps, instructions, conservation)
- [ ] Implémenter routes CRUD complètes
- [ ] Pagination + filtres + recherche
- [ ] Tests unitaires + intégration

---

### US-013 : Recipe Service - Ajout ingrédients à recette
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux ajouter des ingrédients à ma recette afin de définir sa composition.

**Critères d'acceptation** :
- [ ] POST /recipes/:id/ingredients ajoute un ingrédient
- [ ] Quantité + unité (g, kg, L, ml, pièce)
- [ ] Pourcentage de perte configurable
- [ ] DELETE /recipes/:id/ingredients/:ingredientId

**Tâches** :
- [ ] Créer schema RecipeIngredient
- [ ] Implémenter routes POST/DELETE ingredients
- [ ] Validation quantité + unités
- [ ] Tests

---

### US-014 : Recipe Service - Calcul allergènes
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir automatiquement les allergènes de ma recette afin de respecter la réglementation (14 ADO).

**Critères d'acceptation** :
- [ ] Service détecte les 14 allergènes obligatoires
- [ ] Calcul automatique à la sauvegarde de la recette
- [ ] Affichage dans GET /recipes/:id
- [ ] Allergènes : gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques

**Tâches** :
- [ ] Créer service allergen
- [ ] Fonction de détection automatique
- [ ] Hook après sauvegarde recette
- [ ] Tests unitaires

---

### US-015 : Recipe Service - Calcul valeurs nutritionnelles
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir automatiquement les valeurs nutritionnelles afin de les afficher sur mes étiquettes.

**Critères d'acceptation** :
- [ ] Service calcule pour 100g
- [ ] Calories, protéines, glucides, lipides, sel
- [ ] Calcul automatique à la sauvegarde
- [ ] Mise en cache Redis (1h)

**Tâches** :
- [ ] Créer service nutrition
- [ ] Fonction calcul pour 100g
- [ ] Cache Redis avec TTL 1h
- [ ] Tests unitaires

---

### US-016 : Recipe Service - Calcul coût de revient
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir le coût de revient automatique afin de fixer mon prix de vente.

**Critères d'acceptation** :
- [ ] Service calcule le coût avec pertes
- [ ] Coût = somme(quantité * prix * (1 + perte%))
- [ ] Suggestion prix de vente avec coefficient
- [ ] Affichage marge en %

**Tâches** :
- [ ] Créer service pricing
- [ ] Calcul coût avec pertes
- [ ] Calcul marge et suggestion prix
- [ ] Tests

---

### US-017 : Frontend - Pages Auth (Login/Register)
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux des pages de connexion et inscription afin d'accéder à l'application.

**Critères d'acceptation** :
- [ ] Page /login avec formulaire
- [ ] Page /register avec formulaire complet
- [ ] Validation formulaire (Zod + React Hook Form)
- [ ] Affichage erreurs serveur
- [ ] Redirection après login réussi
- [ ] Token stocké dans localStorage

**Tâches** :
- [ ] Setup Frontend Docker + Vite + React
- [ ] Créer pages Login/Register
- [ ] Validation formulaires
- [ ] Store Zustand pour auth
- [ ] Tests

---

### US-018 : Frontend - Dashboard
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir un tableau de bord afin d'avoir une vue d'ensemble.

**Critères d'acceptation** :
- [ ] Page /dashboard
- [ ] Nombre de recettes créées
- [ ] Recettes les plus rentables (top 5)
- [ ] Graphique : recettes créées par mois

**Tâches** :
- [ ] Créer page Dashboard
- [ ] API stats + graphiques
- [ ] Responsive design

---

### US-019 : Frontend - Liste des recettes
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir toutes mes recettes afin de les gérer facilement.

**Critères d'acceptation** :
- [ ] Page /recipes avec tableau
- [ ] Colonnes : Nom, Catégorie, Coût, Prix, Marge, Actions
- [ ] Filtres : catégorie, recherche texte
- [ ] Pagination (50/page)
- [ ] Bouton "Nouvelle recette"

**Tâches** :
- [ ] Créer page liste recettes
- [ ] Tableau avec filtres + pagination
- [ ] Actions Edit/Delete
- [ ] Tests

---

### US-020 : Frontend - Formulaire création recette
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux un formulaire intuitif afin de créer une recette en <10 min.

**Critères d'acceptation** :
- [ ] Formulaire multi-étapes (stepper)
- [ ] Étape 1 : Informations générales (nom, catégorie, portions, temps prépa/cuisson, instructions)
- [ ] Étape 2 : Ajout ingrédients (autocomplete)
- [ ] Étape 3 : Révision (coût, allergènes, nutrition)
- [ ] Calculs en temps réel
- [ ] Sauvegarde automatique (brouillon)

**Tâches** :
- [ ] Créer formulaire stepper 3 étapes
- [ ] Champs temps + instructions + conservation
- [ ] Autocomplete ingrédients
- [ ] Preview avec calculs temps réel
- [ ] Validation + sauvegarde
- [ ] Tests

---

### US-021 : Recipe Service - Sous-recettes (compositions)
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux utiliser une recette comme ingrédient d'une autre recette afin de gérer mes compositions complexes.

**Critères d'acceptation** :
- [ ] Une recette peut contenir d'autres recettes comme ingrédients
- [ ] Calculs en cascade (allergènes, nutrition, coûts)
- [ ] Pas de boucle infinie (validation)

**Tâches** :
- [ ] Ajouter champ subRecipes dans RecipeIngredient
- [ ] Fonction récursive pour calculs
- [ ] Validation anti-boucle
- [ ] Tests

---

### US-022 : Recipe Service - Upload photo recette
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux ajouter une photo à ma recette afin d'avoir un visuel.

**Critères d'acceptation** :
- [ ] POST /recipes/:id/image upload vers MinIO
- [ ] Formats acceptés : JPG, PNG, WebP
- [ ] Taille max : 5MB
- [ ] Compression automatique
- [ ] URL stockée dans Recipe.imageUrl

**Tâches** :
- [ ] Route upload image
- [ ] Validation format + taille
- [ ] Upload MinIO bucket recipe-images
- [ ] Compression avec Sharp
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
- [ ] Inscription + Connexion fonctionnelles
- [ ] Création d'une recette avec ingrédients
- [ ] Affichage calculs automatiques (allergènes, nutrition, coûts)
- [ ] Liste des recettes

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

- ✅ Code testé (>80% coverage backend)
- ✅ Code review approuvée
- ✅ Documentation API (Swagger)
- ✅ Tests manuels OK
- ✅ Déployé en staging

---

**Status** : � EN COURS  
**Date de début** : 23 octobre 2025  
**Dernière mise à jour** : 23 octobre 2025
