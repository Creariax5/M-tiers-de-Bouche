# 🗺️ GUIDE DE NAVIGATION DU PROJET

> **Pour l'IA** : Ce document te dit EXACTEMENT où chercher chaque information

## 📂 STRUCTURE DE LA DOCUMENTATION

```
docs/
├── IMPORTANT_INSTRUCTIONS_V2.md  ← 🔥 LIRE EN PREMIER (règles critiques)
├── NAVIGATION.md                 ← 📍 TU ES ICI (index de tout)
├── cahier_des_charges.md         ← 📋 Vision métier, fonctionnalités
├── technical_specs.md            ← 🔧 Schémas Prisma, API specs
├── CONFORMITE_LEGALE.md          ← ⚖️ Règlement INCO (300k€ amende)
├── design_system.md              ← 🎨 Standards de code
├── plan_projet_dev.md            ← 🏗️ Architecture globale
├── product_backlog.md            ← 📊 Toutes les User Stories
├── security_plan.md              ← 🔐 Sécurité, RGPD, JWT
└── sprints/
    ├── sprint-0-infrastructure.md  ← ✅ DONE
    ├── sprint-1-auth-recipes.md    ← 🔄 EN COURS
    ├── sprint-2-ingredients.md
    ├── sprint-3-labels.md
    ├── sprint-4-production.md
    ├── sprint-5-stripe.md
    └── complete/
        ├── US-001-COMPLETED.md
        ├── US-002-003-004-COMPLETED.md
        └── ... (historique des US terminées)
```

---

## 🎯 JE CHERCHE... → JE VAIS OÙ ?

### 🚀 Démarrage d'une nouvelle US

1. **LIRE EN PREMIER** : `IMPORTANT_INSTRUCTIONS_V2.md` (règles de dev)
2. **User Story** : `sprints/sprint-X.md` → Section "US-XXX: Nom"
   - Critères d'acceptation
   - Points de complexité
   - Dépendances techniques
3. **Schémas DB** : `technical_specs.md` → Section "Prisma Schema"
4. **Standards** : `design_system.md` → Patterns à suivre

### 📊 Comprendre une fonctionnalité métier

| Fonctionnalité | Document | Section |
|----------------|----------|---------|
| Authentification | `cahier_des_charges.md` | Section 4.1 |
| Recettes | `cahier_des_charges.md` | Section 4.2 |
| Allergènes INCO | `CONFORMITE_LEGALE.md` | Toute la section Allergènes |
| Nutrition INCO | `CONFORMITE_LEGALE.md` | Toute la section Nutrition |
| Étiquettes PDF | `cahier_des_charges.md` | Section 4.4 |
| Production | `cahier_des_charges.md` | Section 4.5 |
| Paiements Stripe | `cahier_des_charges.md` | Section 4.7 |

### 🔧 Comprendre la technique

| Besoin | Document | Section |
|--------|----------|---------|
| Schémas Prisma | `technical_specs.md` | "Prisma Schema" |
| Structure API | `technical_specs.md` | "API Endpoints" |
| JWT / Auth | `security_plan.md` | "Authentication" |
| RGPD | `security_plan.md` | "RGPD Compliance" |
| Docker | `plan_projet_dev.md` | "Infrastructure" |
| Microservices | `plan_projet_dev.md` | "Architecture" |

### 🚨 Éviter les erreurs passées

**Document** : `IMPORTANT_INSTRUCTIONS_V2.md`  
**Section** : "ERREURS CRITIQUES DOCUMENTÉES"

7 erreurs documentées avec symptômes + impacts + correctifs :
1. Lecture incomplète de doc
2. Faux tokens JWT
3. SQL manuel
4. Skip TDD
5. Affirmer sans vérifier
6. Tests isolés sans intégration
7. Décalage routes vs tests

### ⚖️ Vérifier conformité légale

**Avant de toucher** : allergènes, nutrition, étiquettes  
**Document** : `CONFORMITE_LEGALE.md` (LIRE EN ENTIER)

**Checklist rapide** :
- [ ] 14 allergènes en GRAS ou MAJUSCULES ?
- [ ] Nutrition pour 100g avec kJ ET kcal ?
- [ ] Sel avec 2 décimales ?
- [ ] Arrondis conformes Annexe XV ?

---

## 🔄 WORKFLOW TYPE PAR SCÉNARIO

### Scénario 1 : Nouvelle US Backend (ex: US-021 Sous-recettes)

```
1. Lire sprints/sprint-1-auth-recipes.md → Section US-021
2. Lire technical_specs.md → Schéma RecipeIngredient
3. Lire CONFORMITE_LEGALE.md si allergènes/nutrition impactés
4. Ouvrir IMPORTANT_INSTRUCTIONS_V2.md → Checklist TDD
5. Coder par micro-étapes (validator → service → controller → route → test)
6. Commit quand tests passent
7. Mettre à jour sprint-1-auth-recipes.md (points, statut)
```

### Scénario 2 : Nouvelle US Frontend (ex: Page création recette)

```
1. Lire sprints/sprint-1-auth-recipes.md → Section US-XXX
2. Lire design_system.md → Composants UI disponibles
3. Lire technical_specs.md → API endpoints à appeler
4. Ouvrir IMPORTANT_INSTRUCTIONS_V2.md → Standards React
5. Écrire tests React Testing Library
6. Implémenter composant
7. Tester dans navigateur après docker-compose up
8. Commit + Mettre à jour sprint
```

### Scénario 3 : Bug en production

```
1. Reproduire le bug dans Docker
2. Vérifier IMPORTANT_INSTRUCTIONS_V2.md → "ERREURS CRITIQUES"
   (Le bug est-il une erreur déjà documentée ?)
3. Si oui → Appliquer le correctif documenté
4. Si non → Débugger, corriger, DOCUMENTER dans IMPORTANT_INSTRUCTIONS
5. Ajouter test de non-régression
6. Commit avec message "fix: description du bug"
```

### Scénario 4 : Refactoring / Amélioration

```
1. Lire design_system.md → Standards à respecter
2. Lire technical_specs.md → Architecture actuelle
3. Vérifier que TOUS les tests passent avant refactoring
4. Refactorer par micro-étapes
5. Tests doivent passer après CHAQUE étape
6. Si un test échoue → STOP et corriger
7. Commit quand terminé
```

---

## 📖 LECTURE OBLIGATOIRE SELON LE CONTEXTE

### Avant TOUTE modification de code

- [ ] `IMPORTANT_INSTRUCTIONS_V2.md` (5-10 min)

### Backend - Nouvelle API

- [ ] `sprints/sprint-X.md` → User Story
- [ ] `technical_specs.md` → Schémas Prisma
- [ ] `design_system.md` → Standards code

### Backend - Allergènes ou Nutrition

- [ ] `CONFORMITE_LEGALE.md` (15-20 min, CRITIQUE)
- [ ] `technical_specs.md` → Champs obligatoires

### Frontend - Nouvelle page

- [ ] `design_system.md` → Composants UI
- [ ] `technical_specs.md` → API à consommer
- [ ] `cahier_des_charges.md` → Specs UX

### Infrastructure - Docker/Prisma

- [ ] `plan_projet_dev.md` → Architecture
- [ ] `technical_specs.md` → Schémas DB
- [ ] `IMPORTANT_INSTRUCTIONS_V2.md` → Erreur "SQL manuel"

---

## 🎯 DOCUMENTS PAR ORDRE D'IMPORTANCE

### 🔥 CRITIQUE (Lire avant toute modification)
1. **IMPORTANT_INSTRUCTIONS_V2.md** → Règles de survie
2. **NAVIGATION.md** (ce fichier) → Où trouver l'info

### ⭐ ESSENTIEL (Selon contexte)
3. **sprints/sprint-X.md** → User Stories actives
4. **technical_specs.md** → Schémas + API
5. **CONFORMITE_LEGALE.md** → Si allergènes/nutrition

### 📚 RÉFÉRENCE (Consultation ponctuelle)
6. **cahier_des_charges.md** → Vision métier
7. **design_system.md** → Standards code
8. **security_plan.md** → Sécurité, RGPD
9. **plan_projet_dev.md** → Architecture globale

### 📦 HISTORIQUE (Archivage)
10. **product_backlog.md** → Toutes les US (planning)
11. **sprints/complete/US-XXX-COMPLETED.md** → US terminées

---

## 🔍 RECHERCHE RAPIDE PAR MOT-CLÉ

| Je cherche... | Document | Commande grep |
|---------------|----------|---------------|
| "allergène" | CONFORMITE_LEGALE.md | `grep -i "allergène" docs/*.md` |
| "prisma" | technical_specs.md | `grep -i "prisma" docs/*.md` |
| "JWT" | security_plan.md | `grep -i "jwt" docs/*.md` |
| "US-021" | sprints/sprint-1-auth-recipes.md | `grep "US-021" docs/sprints/*.md` |
| Erreur passée | IMPORTANT_INSTRUCTIONS_V2.md | Chercher "❌" |

---

## 💡 CONSEILS POUR L'IA

### ✅ Bonnes pratiques de navigation

1. **TOUJOURS commencer par** `IMPORTANT_INSTRUCTIONS_V2.md`
2. **User Story = source de vérité** → `sprints/sprint-X.md`
3. **En cas de doute légal** → `CONFORMITE_LEGALE.md`
4. **Architecture technique** → `technical_specs.md`
5. **Standards de code** → `design_system.md`

### ❌ Pièges à éviter

1. ❌ Ne pas lire que les titres (lire sections complètes)
2. ❌ Ne pas assumer que la doc est à jour (vérifier le code aussi)
3. ❌ Ne pas ignorer `CONFORMITE_LEGALE.md` (300k€ en jeu)
4. ❌ Ne pas sauter les "Erreurs documentées" dans IMPORTANT_INSTRUCTIONS

### 🎯 Stratégie de lecture efficace

```
1. Scan rapide (2 min) : Table des matières
2. Lecture ciblée (5 min) : Section pertinente EN ENTIER
3. Vérification (2 min) : Exemples de code dans la doc
4. Application (20 min) : Coder en suivant la doc
5. Validation (5 min) : Tests + Vérifier conformité doc
```

---

## 🆘 SI PERDU

**Étape 1** : Respire 30 secondes  
**Étape 2** : Relis `IMPORTANT_INSTRUCTIONS_V2.md` section "PROCÉDURE SI BLOQUÉ"  
**Étape 3** : Identifie ce que tu cherches (voir tableau "JE CHERCHE...")  
**Étape 4** : Ouvre le document correspondant  
**Étape 5** : Lis la section COMPLÈTE (pas juste le titre)  
**Étape 6** : Si toujours perdu → `docker logs <service>` et cherche l'erreur dans les docs

---

**Dernière mise à jour** : 6 novembre 2025  
**Prochaine révision** : Après chaque sprint (ajouter nouvelles erreurs documentées)
