# 🚀 SPRINT 4 : Production Planning & Polish
**Durée** : 2 semaines (Semaines 8-9)  
**Dates** : À définir  
**Sprint Goal** : Planification hebdomadaire de production et optimisation UX

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 67 (46 + 21 nouveaux : bons économat, fiches fabrication, onboarding)
- **Points réalisés** : -
- **Vélocité** : -

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, un artisan peut planifier sa semaine de production et obtenir automatiquement sa liste de courses"**

### Critères de succès
- ✅ Planification hebdomadaire fonctionnelle
- ✅ Calcul automatique ingrédients à commander
- ✅ UX/UI polie et intuitive
- ✅ Performance optimisée

---

## 📝 USER STORIES DU SPRINT

### US-034 : Production Service - Planification hebdomadaire
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux planifier ma production hebdomadaire afin d'organiser mon travail.

**Critères d'acceptation** :
- [ ] POST /production/weeks crée une semaine
- [ ] Ajout recettes + quantités par jour
- [ ] Calcul automatique des ingrédients nécessaires
- [ ] Détection conflits/alertes (stock insuffisant)

**Tâches** :
- [ ] Créer production-service
- [ ] Schema ProductionWeek + ProductionDay
- [ ] Routes CRUD planning
- [ ] Calcul agrégé ingrédients
- [ ] Tests

---

### US-035 : Liste de courses automatique
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux obtenir automatiquement ma liste de courses afin de gagner du temps.

**Critères d'acceptation** :
- [ ] GET /production/weeks/:id/shopping-list
- [ ] Agrégation de tous les ingrédients de la semaine
- [ ] Groupement par catégorie (frais, sec, etc.)
- [ ] Export PDF ou CSV

**Tâches** :
- [ ] Endpoint shopping-list
- [ ] Agrégation + groupement
- [ ] Export PDF/CSV
- [ ] Tests

---

### US-036 : Gestion des stocks
**Points** : 8 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux gérer mon stock d'ingrédients afin d'optimiser mes commandes.

**Critères d'acceptation** :
- [ ] CRUD stock ingrédients
- [ ] Stock actuel vs besoin hebdomadaire
- [ ] Alertes stock bas

**Tâches** :
- [ ] Schema Stock
- [ ] Routes CRUD stock
- [ ] Calcul stock nécessaire
- [ ] Tests

---

### US-037 : Frontend - Planning hebdomadaire
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux un calendrier visuel afin de planifier ma production facilement.

**Critères d'acceptation** :
- [ ] Page /production avec calendrier hebdomadaire
- [ ] Drag & drop recettes sur jours
- [ ] Affichage quantités
- [ ] Vue résumé ingrédients

**Tâches** :
- [ ] Créer page Production
- [ ] Calendrier hebdo (7 jours)
- [ ] Drag & drop recettes
- [ ] Modal ajout recette + quantité
- [ ] Tests

---

### US-038 : Frontend - Liste de courses
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir ma liste de courses afin de préparer mes commandes.

**Critères d'acceptation** :
- [ ] Affichage liste groupée par catégorie
- [ ] Affichage fournisseur par ingrédient
- [ ] Téléchargement PDF
- [ ] Export CSV pour commande en ligne
- [ ] Envoi par email

**Tâches** :
- [ ] Composant ShoppingList avec fournisseurs
- [ ] Export PDF + CSV
- [ ] Envoi email (Resend)
- [ ] Tests

---

### US-038-bis : Production - Bon d'économat
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux générer un bon d'économat afin de tracer les sorties de stock.

**Critères d'acceptation** :
- [ ] GET /production/:id/economat génère PDF
- [ ] Contenu : date, recettes produites, ingrédients sortis avec quantités
- [ ] Signature responsable

**Tâches** :
- [ ] Route génération bon d'économat
- [ ] Template PDF
- [ ] Tests

---

### US-038-ter : Production - Fiches de fabrication labo
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux imprimer des fiches de fabrication afin de les afficher dans mon laboratoire.

**Critères d'acceptation** :
- [ ] GET /recipes/:id/fabrication génère PDF
- [ ] Contenu : nom recette, ingrédients avec quantités, instructions étape par étape, temps prépa/cuisson
- [ ] Format A4 lisible à distance
- [ ] Cases à cocher pour suivi

**Tâches** :
- [ ] Route génération fiche fabrication
- [ ] Template PDF adapté labo
- [ ] Tests

---

### US-039 : Polish UX/UI général
**Points** : 8 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux une interface fluide et intuitive afin d'utiliser l'app avec plaisir.

**Critères d'acceptation** :
- [ ] Animations micro-interactions
- [ ] Loading states partout
- [ ] Messages de succès/erreur clairs
- [ ] Responsive mobile optimisé
- [ ] Tests accessibilité (WCAG AA)

**Tâches** :
- [ ] Audit UX complet
- [ ] Animations (framer-motion)
- [ ] Loading states
- [ ] Toast notifications
- [ ] Tests accessibilité

---

### US-039-bis : Onboarding guidé
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux être guidé lors de ma première utilisation afin d'être opérationnel en <30 min.

**Critères d'acceptation** :
- [ ] Tunnel onboarding après inscription
- [ ] Étape 1 : Configuration entreprise (nom, adresse, logo, marges par défaut)
- [ ] Étape 2 : Création de 3 premières recettes (guidé)
- [ ] Étape 3 : Génération d'une première étiquette (démo)
- [ ] Progression sauvegardée
- [ ] Possibilité de skip

**Tâches** :
- [ ] Composant Onboarding stepper
- [ ] 3 étapes interactives
- [ ] Sauvegarde progression
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
- [ ] Planification hebdomadaire production
- [ ] Liste de courses automatique
- [ ] UX polie et fluide

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

**Status** : 🔴 NOT STARTED  
**Dernière mise à jour** : 22 octobre 2025
