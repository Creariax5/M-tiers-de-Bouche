# 📋 PRODUCT BACKLOG
## SaaS Métiers de Bouche - Gestion Agile

**Date de création** : 22 octobre 2025  
**Product Owner** : À définir  
**Scrum Master** : À définir  
**Sprint Duration** : 2 semaines

---

## 🎯 Vision Produit

Créer le logiciel n°1 des artisans des métiers de bouche pour leur faire gagner 85-90% du temps sur les obligations réglementaires (fiches techniques HACCP, étiquetages, calculs nutritionnels).

### Objectifs SMART
- **100 clients payants** à la fin de l'année 1
- **Temps de création de fiche technique** : de 2-3h → 10 minutes
- **Taux de conversion essai→payant** : >30%
- **Churn rate** : <5%/mois

---

## 📊 PRIORITÉS (MoSCoW)

- 🔴 **MUST** : Fonctionnalités critiques pour le MVP
- 🟡 **SHOULD** : Importantes mais non bloquantes
- 🟢 **COULD** : Nice to have
- ⚪ **WON'T** : Pas dans cette version

---

## 🏗️ EPICS

### Epic 1️⃣ : Infrastructure & Setup Docker
**Valeur business** : Base technique nécessaire pour tout le reste  
**Estimation** : 40 points

### Epic 2️⃣ : Authentification & Gestion Utilisateurs
**Valeur business** : Sécurité et gestion des abonnements  
**Estimation** : 21 points

### Epic 3️⃣ : Gestion des Recettes
**Valeur business** : ⭐⭐⭐⭐⭐ Cœur du produit, gain de temps massif  
**Estimation** : 55 points

### Epic 4️⃣ : Base d'Ingrédients
**Valeur business** : ⭐⭐⭐⭐⭐ Pré-remplissage = valeur ajoutée immédiate  
**Estimation** : 34 points

### Epic 5️⃣ : Génération d'Étiquettes
**Valeur business** : ⭐⭐⭐⭐⭐ Obligation légale, besoin critique  
**Estimation** : 34 points

### Epic 6️⃣ : Planning de Production
**Valeur business** : ⭐⭐⭐⭐ Organisation du travail quotidien  
**Estimation** : 21 points

### Epic 7️⃣ : Paiements & Abonnements
**Valeur business** : ⭐⭐⭐⭐⭐ Monétisation  
**Estimation** : 21 points

### Epic 8️⃣ : Frontend & UX
**Valeur business** : ⭐⭐⭐⭐⭐ Interface utilisateur  
**Estimation** : 55 points

---

## 📝 BACKLOG DÉTAILLÉ

### 🔴 Sprint 0 : Infrastructure & Setup (Semaine 1)

#### US-001 : Setup Docker Compose
**En tant que** développeur  
**Je veux** un environnement Docker complet  
**Afin de** développer localement avec tous les services  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] docker-compose.yml contient tous les services (frontend, api-gateway, auth, recipe, label, production)
- [ ] Réseau Docker `saas-network` configuré
- [ ] Volumes persistants pour PostgreSQL, Redis, MinIO
- [ ] `docker-compose up -d` démarre tous les services sans erreur
- [ ] Healthchecks sur tous les services fonctionnels

**Tâches techniques** :
- Créer docker-compose.yml
- Configurer network bridge
- Setup volumes
- Tester le démarrage

---

#### US-002 : Configuration PostgreSQL Multi-DB
**En tant que** développeur  
**Je veux** plusieurs bases de données PostgreSQL isolées  
**Afin que** chaque microservice ait sa propre DB  
**Priorité** : 🔴 MUST | **Points** : 5 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] Script `init-databases.sh` crée 3 bases : saas_auth, saas_recipes, saas_production
- [ ] Chaque service peut se connecter à sa DB
- [ ] Isolation complète entre les bases

**Tâches techniques** :
- Créer script init-databases.sh
- Configurer DATABASE_URL par service
- Tester connexions

---

#### US-003 : Setup Redis Cache
**En tant que** développeur  
**Je veux** un service Redis  
**Afin de** cacher les calculs nutritionnels et gérer les sessions  
**Priorité** : 🔴 MUST | **Points** : 3 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] Container Redis démarré
- [ ] Connexion depuis services backend OK
- [ ] Persistance activée (appendonly yes)

---

#### US-004 : Setup MinIO (S3 local)
**En tant que** développeur  
**Je veux** un stockage S3-compatible  
**Afin de** stocker photos et PDFs localement  
**Priorité** : 🔴 MUST | **Points** : 5 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] MinIO démarré avec console accessible (localhost:9001)
- [ ] Buckets créés : recipes-photos, labels-pdf
- [ ] Upload/download fonctionnel

---

#### US-005 : Setup CI/CD GitHub Actions
**En tant que** développeur  
**Je veux** un pipeline CI/CD  
**Afin de** automatiser les tests et déploiements  
**Priorité** : 🟡 SHOULD | **Points** : 8 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] Workflow test.yml : lance tests sur PR
- [ ] Workflow docker-build.yml : build images Docker
- [ ] Workflow deploy.yml : déploie en staging/prod

---

#### US-006 : Variables d'environnement
**En tant que** développeur  
**Je veux** un fichier .env.example  
**Afin de** configurer facilement l'environnement  
**Priorité** : 🔴 MUST | **Points** : 2 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] .env.example contient toutes les variables nécessaires
- [ ] Documentation des variables dans le fichier
- [ ] .env ajouté au .gitignore

---

#### US-007 : API Gateway - Setup
**En tant que** développeur  
**Je veux** un API Gateway centralisé  
**Afin de** router les requêtes vers les microservices  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 1️⃣

**Critères d'acceptation** :
- [ ] Service api-gateway démarre sur port 3000
- [ ] Routing vers auth-service, recipe-service, label-service, production-service
- [ ] CORS configuré
- [ ] Rate limiting global (100 req/15min)
- [ ] Helmet pour headers de sécurité

---

### 🔴 Sprint 1 : Auth Service & Recipe Service Base (Semaines 2-3)

#### US-008 : Auth Service - Inscription utilisateur
**En tant qu'** artisan  
**Je veux** créer un compte  
**Afin de** utiliser l'application  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 2️⃣

**Critères d'acceptation** :
- [ ] POST /auth/register crée un utilisateur
- [ ] Password hashé avec bcrypt
- [ ] Validation email unique
- [ ] Email de bienvenue envoyé (Resend)
- [ ] Essai gratuit 14 jours activé

**Schéma Prisma** :
```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  companyName String?
  plan        Plan     @default(STARTER)
  trialEndsAt DateTime?
  createdAt   DateTime @default(now())
}
```

---

#### US-009 : Auth Service - Connexion JWT
**En tant qu'** artisan  
**Je veux** me connecter  
**Afin d'** accéder à mes recettes  
**Priorité** : 🔴 MUST | **Points** : 5 | **Epic** : 2️⃣

**Critères d'acceptation** :
- [ ] POST /auth/login retourne JWT token (7 jours)
- [ ] Validation email/password
- [ ] Token contient userId + email
- [ ] Refresh token géré

---

#### US-010 : Auth Service - Middleware JWT
**En tant que** développeur  
**Je veux** un middleware de vérification JWT  
**Afin de** sécuriser toutes les routes API  
**Priorité** : 🔴 MUST | **Points** : 3 | **Epic** : 2️⃣

**Critères d'acceptation** :
- [ ] Middleware `authenticateToken` vérifie le JWT
- [ ] Retourne 401 si token manquant
- [ ] Retourne 403 si token invalide
- [ ] Injecte `req.user` pour routes suivantes

---

#### US-011 : Auth Service - Profil utilisateur
**En tant qu'** artisan  
**Je veux** voir et modifier mon profil  
**Afin de** mettre à jour mes informations  
**Priorité** : 🟡 SHOULD | **Points** : 5 | **Epic** : 2️⃣

**Critères d'acceptation** :
- [ ] GET /auth/me retourne profil utilisateur
- [ ] PUT /auth/me met à jour le profil
- [ ] Upload logo entreprise vers MinIO

---

#### US-012 : Recipe Service - CRUD Recettes
**En tant qu'** artisan  
**Je veux** créer, lire, modifier, supprimer mes recettes  
**Afin de** gérer mon catalogue  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 3️⃣

**Critères d'acceptation** :
- [ ] POST /recipes crée une recette
- [ ] GET /recipes liste mes recettes (pagination)
- [ ] GET /recipes/:id détail d'une recette
- [ ] PUT /recipes/:id modifie une recette
- [ ] DELETE /recipes/:id supprime une recette
- [ ] Filtres par catégorie
- [ ] Recherche par nom

**Schéma Prisma** :
```prisma
model Recipe {
  id          String   @id @default(uuid())
  userId      String
  name        String
  category    Category
  servings    Int      @default(1)
  costPrice   Float    @default(0)
  createdAt   DateTime @default(now())
}
```

---

#### US-013 : Recipe Service - Ajout ingrédients à recette
**En tant qu'** artisan  
**Je veux** ajouter des ingrédients à ma recette  
**Afin de** définir sa composition  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 3️⃣

**Critères d'acceptation** :
- [ ] POST /recipes/:id/ingredients ajoute un ingrédient
- [ ] Quantité + unité (g, kg, L, ml, pièce)
- [ ] Pourcentage de perte configurable
- [ ] DELETE /recipes/:id/ingredients/:ingredientId

---

#### US-014 : Recipe Service - Calcul allergènes
**En tant qu'** artisan  
**Je veux** voir automatiquement les allergènes de ma recette  
**Afin de** respecter la réglementation (14 ADO)  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 3️⃣

**Critères d'acceptation** :
- [ ] Service `allergen.service.ts` détecte les 14 allergènes
- [ ] Calcul automatique à la sauvegarde de la recette
- [ ] Affichage dans GET /recipes/:id
- [ ] Allergènes : gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques

**Algorithme** :
```typescript
// Pour chaque ingrédient de la recette
// → récupérer ses allergènes (depuis BaseIngredient ou CustomIngredient)
// → ajouter à l'array sans doublons
```

---

#### US-015 : Recipe Service - Calcul valeurs nutritionnelles
**En tant qu'** artisan  
**Je veux** voir automatiquement les valeurs nutritionnelles  
**Afin de** les afficher sur mes étiquettes  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 3️⃣

**Critères d'acceptation** :
- [ ] Service `nutrition.service.ts` calcule pour 100g
- [ ] Calories, protéines, glucides, lipides, sel
- [ ] Calcul automatique à la sauvegarde
- [ ] Mise en cache Redis (1h)

**Formule** :
```
Pour chaque ingrédient :
  quantité_100g = (quantité_ingrédient / poids_total_recette) * 100
  calories += quantité_100g * calories_ingredient / 100
  protéines += quantité_100g * protéines_ingredient / 100
  etc.
```

---

#### US-016 : Recipe Service - Calcul coût de revient
**En tant qu'** artisan  
**Je veux** voir le coût de revient automatique  
**Afin de** fixer mon prix de vente  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 3️⃣

**Critères d'acceptation** :
- [ ] Service `pricing.service.ts` calcule le coût
- [ ] Coût = somme(quantité_ingrédient * prix_unitaire * (1 + perte%))
- [ ] Suggestion prix de vente = coût * coefficient (config utilisateur)
- [ ] Affichage marge en %

---

#### US-017 : Frontend - Pages Auth (Login/Register)
**En tant qu'** artisan  
**Je veux** des pages de connexion et inscription  
**Afin de** accéder à l'application  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /login avec formulaire (email, password)
- [ ] Page /register avec formulaire complet
- [ ] Validation formulaire (Zod + React Hook Form)
- [ ] Affichage erreurs serveur
- [ ] Redirection après login réussi
- [ ] Token stocké dans localStorage

---

#### US-018 : Frontend - Dashboard
**En tant qu'** artisan  
**Je veux** voir un tableau de bord  
**Afin d'** avoir une vue d'ensemble  
**Priorité** : 🟡 SHOULD | **Points** : 5 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /dashboard
- [ ] Nombre de recettes créées
- [ ] Recettes les plus rentables (top 5)
- [ ] Graphique : recettes créées par mois

---

#### US-019 : Frontend - Liste des recettes
**En tant qu'** artisan  
**Je veux** voir toutes mes recettes  
**Afin de** les gérer facilement  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /recipes avec tableau
- [ ] Colonnes : Nom, Catégorie, Coût, Prix, Marge, Actions
- [ ] Filtres : catégorie, recherche texte
- [ ] Pagination (50/page)
- [ ] Bouton "Nouvelle recette"

---

#### US-020 : Frontend - Formulaire création recette
**En tant qu'** artisan  
**Je veux** un formulaire intuitif  
**Afin de** créer une recette en <10 min  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Formulaire multi-étapes (stepper)
- [ ] Étape 1 : Informations générales (nom, catégorie, portions)
- [ ] Étape 2 : Ajout ingrédients (autocomplete)
- [ ] Étape 3 : Révision (coût, allergènes, nutrition)
- [ ] Calculs en temps réel
- [ ] Sauvegarde automatique (brouillon)

---

### 🔴 Sprint 2 : Base Ingrédients & Frontend Recettes (Semaines 4-5)

#### US-021 : Import base Ciqual ANSES
**En tant que** Product Owner  
**Je veux** une base de 1000+ ingrédients pré-remplie  
**Afin que** les artisans gagnent du temps  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 4️⃣

**Critères d'acceptation** :
- [ ] Script `seed-ingredients.ts` importe CSV Ciqual
- [ ] 1000+ ingrédients dans table BaseIngredient
- [ ] Catégorisation : Farines, Sucres, Matières grasses, Produits laitiers, etc.
- [ ] Valeurs nutritionnelles complètes
- [ ] Allergènes mappés

**Source de données** :
- Base Ciqual ANSES : https://ciqual.anses.fr/

---

#### US-022 : Recipe Service - Recherche ingrédients
**En tant qu'** artisan  
**Je veux** chercher un ingrédient facilement  
**Afin de** l'ajouter rapidement à ma recette  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 4️⃣

**Critères d'acceptation** :
- [ ] GET /ingredients?search=fari retourne les ingrédients
- [ ] Recherche insensible à la casse
- [ ] Recherche dans BaseIngredient + CustomIngredient
- [ ] Autocomplete après 2 caractères
- [ ] Limite 20 résultats

---

#### US-023 : Recipe Service - Ingrédients personnalisés
**En tant qu'** artisan  
**Je veux** ajouter mes propres ingrédients  
**Afin d'** avoir mes fournisseurs spécifiques  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 4️⃣

**Critères d'acceptation** :
- [ ] POST /ingredients/custom crée un ingrédient perso
- [ ] Champs : nom, prix, unité, fournisseur, valeurs nutritionnelles
- [ ] Calcul automatique si valeurs nutritionnelles manquantes (estimation)
- [ ] GET /ingredients/custom liste mes ingrédients perso

---

#### US-024 : Recipe Service - Traçabilité ingrédients
**En tant qu'** artisan  
**Je veux** enregistrer les lots et DLC  
**Afin de** respecter la traçabilité HACCP  
**Priorité** : 🟡 SHOULD | **Points** : 5 | **Epic** : 4️⃣

**Critères d'acceptation** :
- [ ] Champs lotNumber, expiryDate sur CustomIngredient
- [ ] Alerte si DLC dépassée dans production

---

#### US-025 : Frontend - Gestion ingrédients personnalisés
**En tant qu'** artisan  
**Je veux** gérer mes ingrédients perso  
**Afin d'** avoir mon catalogue  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /ingredients
- [ ] Tableau avec mes ingrédients perso
- [ ] Formulaire ajout/édition
- [ ] Filtres et recherche

---

#### US-026 : Frontend - Détail recette avec calculs
**En tant qu'** artisan  
**Je veux** voir tous les détails calculés  
**Afin de** valider ma recette  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /recipes/:id
- [ ] Affichage : nom, catégorie, portions, temps
- [ ] Liste ingrédients avec quantités
- [ ] Bloc "Allergènes" avec badges
- [ ] Bloc "Valeurs nutritionnelles" (tableau 100g)
- [ ] Bloc "Coûts" : coût de revient, prix suggéré, marge

---

#### US-027 : Frontend - Upload photo recette
**En tant qu'** artisan  
**Je veux** ajouter une photo à ma recette  
**Afin d'** avoir un visuel  
**Priorité** : 🟢 COULD | **Points** : 5 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Drag & drop photo
- [ ] Upload vers MinIO via recipe-service
- [ ] Formats : JPG, PNG, WebP
- [ ] Taille max : 5 MB
- [ ] Compression automatique

---

### 🔴 Sprint 3 : Label Service - Génération Étiquettes (Semaines 6-7)

#### US-028 : Label Service - Génération PDF basique
**En tant qu'** artisan  
**Je veux** générer une étiquette PDF  
**Afin d'** imprimer mes étiquettes réglementaires  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 5️⃣

**Critères d'acceptation** :
- [ ] POST /labels génère un PDF
- [ ] Appel à recipe-service pour récupérer données
- [ ] Template avec : nom produit, ingrédients (allergènes en gras), valeurs nutritionnelles, date fabrication, poids net, coordonnées fabricant
- [ ] Upload PDF vers MinIO
- [ ] Retourne URL du PDF

**Stack** :
- PDFKit pour génération
- Fonts : Arial (lisibilité)

---

#### US-029 : Label Service - Template réglementaire
**En tant qu'** artisan  
**Je veux** une étiquette conforme à la réglementation  
**Afin de** ne pas avoir d'amende  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 5️⃣

**Critères d'acceptation** :
- [ ] Liste ingrédients par ordre décroissant de poids
- [ ] Allergènes en GRAS ou CAPITALES
- [ ] Tableau nutritionnel pour 100g (obligatoire)
- [ ] Mentions obligatoires : "À conserver à...", "Fabriqué par...", poids net

**Référence légale** :
- Règlement UE n°1169/2011 (INCO)

---

#### US-030 : Label Service - Formats multiples
**En tant qu'** artisan  
**Je veux** choisir le format d'étiquette  
**Afin d'** adapter à mon imprimante  
**Priorité** : 🟡 SHOULD | **Points** : 5 | **Epic** : 5️⃣

**Critères d'acceptation** :
- [ ] Formats disponibles : 40x30mm, 50x30mm, 70x50mm, A4, personnalisé
- [ ] Paramètre `?format=50x30` dans la requête
- [ ] Ajustement automatique de la taille de police

---

#### US-031 : Label Service - Personnalisation (logo)
**En tant qu'** artisan  
**Je veux** ajouter mon logo  
**Afin d'** avoir une étiquette à mon image  
**Priorité** : 🟡 SHOULD | **Points** : 5 | **Epic** : 5️⃣

**Critères d'acceptation** :
- [ ] Logo récupéré depuis profil utilisateur
- [ ] Intégré en haut de l'étiquette
- [ ] Redimensionnement automatique

---

#### US-032 : Label Service - Historique étiquettes
**En tant qu'** artisan  
**Je veux** retrouver mes étiquettes générées  
**Afin de** les réimprimer  
**Priorité** : 🟢 COULD | **Points** : 3 | **Epic** : 5️⃣

**Critères d'acceptation** :
- [ ] Table Label : recipeId, userId, pdfUrl, createdAt
- [ ] GET /labels liste historique
- [ ] Téléchargement du PDF

---

#### US-033 : Frontend - Génération étiquettes
**En tant qu'** artisan  
**Je veux** générer une étiquette en 1 clic  
**Afin de** gagner du temps  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /labels
- [ ] Sélection recette (dropdown)
- [ ] Choix format étiquette
- [ ] Bouton "Générer"
- [ ] Preview PDF dans modal
- [ ] Bouton "Télécharger" et "Imprimer"

---

### 🔴 Sprint 4 : Production Service & Polish (Semaines 8-9)

#### US-034 : Production Service - Planning hebdomadaire
**En tant qu'** artisan  
**Je veux** planifier ma production  
**Afin de** m'organiser  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 6️⃣

**Critères d'acceptation** :
- [ ] POST /production crée une tâche de production
- [ ] Champs : date, recetteId, quantité, statut
- [ ] GET /production?week=2024-W42 liste la semaine
- [ ] Statuts : PLANNED, IN_PROGRESS, COMPLETED, CANCELLED

---

#### US-035 : Production Service - Calcul ingrédients nécessaires
**En tant qu'** artisan  
**Je veux** voir les quantités totales d'ingrédients  
**Afin de** savoir quoi acheter  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 6️⃣

**Critères d'acceptation** :
- [ ] GET /production/ingredients?week=2024-W42
- [ ] Appel à recipe-service pour chaque recette
- [ ] Agrégation par ingrédient
- [ ] Retourne : ingredient, quantité totale, unité

**Exemple** :
```json
[
  { "ingredient": "Farine T55", "quantity": 5.2, "unit": "kg" },
  { "ingredient": "Sucre", "quantity": 1.8, "unit": "kg" }
]
```

---

#### US-036 : Production Service - Liste de courses
**En tant qu'** artisan  
**Je veux** une liste de courses imprimable  
**Afin de** faire mes achats  
**Priorité** : 🟡 SHOULD | **Points** : 5 | **Epic** : 6️⃣

**Critères d'acceptation** :
- [ ] GET /production/shopping-list?week=2024-W42
- [ ] Format PDF ou CSV
- [ ] Colonnes : Ingrédient, Quantité, Unité, Fournisseur

---

#### US-037 : Frontend - Planning de production
**En tant qu'** artisan  
**Je veux** visualiser mon planning  
**Afin de** voir ma charge de travail  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Page /production
- [ ] Vue calendrier hebdomadaire
- [ ] Drag & drop pour planifier
- [ ] Ajout rapide : recette + quantité + date
- [ ] Changement de statut (boutons)

---

#### US-038 : Frontend - UI/UX Polish
**En tant qu'** artisan  
**Je veux** une interface moderne et intuitive  
**Afin de** ne pas perdre de temps  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Design system cohérent (shadcn/ui)
- [ ] Animations fluides
- [ ] Loading states sur toutes les actions
- [ ] Messages de succès/erreur (toast)
- [ ] Responsive (desktop + tablette)
- [ ] Lighthouse score >90

---

#### US-039 : Tests End-to-End
**En tant que** développeur  
**Je veux** des tests E2E  
**Afin de** garantir la qualité  
**Priorité** : 🟡 SHOULD | **Points** : 8 | **Epic** : 8️⃣

**Critères d'acceptation** :
- [ ] Playwright pour tests E2E
- [ ] Scénario : Inscription → Créer recette → Générer étiquette
- [ ] Scénario : Login → Planifier production
- [ ] Tests sur Docker Compose

---

### 🟡 Sprint 5 : Stripe & Monétisation (Semaines 10-11)

#### US-040 : Intégration Stripe
**En tant que** Product Owner  
**Je veux** accepter les paiements  
**Afin de** monétiser le SaaS  
**Priorité** : 🔴 MUST | **Points** : 13 | **Epic** : 7️⃣

**Critères d'acceptation** :
- [ ] Stripe SDK installé dans auth-service
- [ ] Création Customer Stripe à l'inscription
- [ ] 3 produits : Starter (39€), Pro (69€), Premium (129€)
- [ ] Checkout Session Stripe
- [ ] Webhooks : `checkout.session.completed`, `customer.subscription.updated`

---

#### US-041 : Page pricing & abonnement
**En tant qu'** artisan  
**Je veux** voir les offres et m'abonner  
**Afin de** débloquer toutes les fonctionnalités  
**Priorité** : 🔴 MUST | **Points** : 8 | **Epic** : 7️⃣

**Critères d'acceptation** :
- [ ] Page /pricing avec les 3 offres
- [ ] Bouton "S'abonner" → Stripe Checkout
- [ ] Page /settings/billing pour gérer l'abonnement
- [ ] Affichage statut : actif, trial, expiré

---

#### US-042 : Limitations par plan
**En tant que** développeur  
**Je veux** limiter les fonctionnalités par plan  
**Afin de** encourager l'upgrade  
**Priorité** : 🔴 MUST | **Points** : 5 | **Epic** : 7️⃣

**Critères d'acceptation** :
- [ ] STARTER : max 50 recettes
- [ ] PRO : illimité
- [ ] PREMIUM : illimité + multi-sites
- [ ] Middleware vérifie les limites

---

### 🟢 Backlog Futur (Post-MVP)

#### US-043 : Gestion des stocks
**Priorité** : 🟢 COULD | **Points** : 21 | **Epic** : Stock Management

#### US-044 : Gestion commandes clients
**Priorité** : 🟢 COULD | **Points** : 21 | **Epic** : Orders

#### US-045 : Export comptable
**Priorité** : 🟢 COULD | **Points** : 8 | **Epic** : Accounting

#### US-046 : Multi-sites
**Priorité** : 🟢 COULD | **Points** : 21 | **Epic** : Multi-tenant

#### US-047 : Application mobile
**Priorité** : ⚪ WON'T | **Points** : 89 | **Epic** : Mobile

---

## 📈 BURNDOWN CHART

| Sprint | Points planifiés | Points réalisés | Vélocité |
|--------|------------------|-----------------|----------|
| Sprint 0 | 40 | - | - |
| Sprint 1 | 55 | - | - |
| Sprint 2 | 34 | - | - |
| Sprint 3 | 34 | - | - |
| Sprint 4 | 46 | - | - |
| Sprint 5 | 21 | - | - |

**Total MVP** : 230 points

---

## 🔄 PROCESS AGILE

### Cérémonies

#### Sprint Planning (Lundi matin, 2h)
- Sélection des User Stories du backlog
- Estimation en points (Planning Poker)
- Définition du Sprint Goal

#### Daily Standup (10h00, 15min)
- Qu'ai-je fait hier ?
- Que vais-je faire aujourd'hui ?
- Y a-t-il des blocages ?

#### Sprint Review (Vendredi, 1h)
- Démo des fonctionnalités terminées
- Collecte feedback

#### Sprint Retrospective (Vendredi, 1h)
- What went well?
- What could be improved?
- Action items

### Definition of Done (DoD)

✅ Une User Story est "Done" si :
- [ ] Code écrit et testé (tests unitaires passent)
- [ ] Code review approuvée
- [ ] Documentation mise à jour
- [ ] Tests manuels OK
- [ ] Déployé en staging
- [ ] Accepté par le Product Owner

---

## 📞 CONTACT

**Product Owner** : À définir  
**Scrum Master** : À définir  
**Dev Team** : À définir

**Version** : 1.0  
**Dernière mise à jour** : 22 octobre 2025
