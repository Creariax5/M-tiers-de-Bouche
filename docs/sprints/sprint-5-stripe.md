# 🚀 SPRINT 5 : Stripe Integration & Monetization
**Durée** : 2 semaines (Semaines 10-11)  
**Dates** : À définir  
**Sprint Goal** : Monétisation avec abonnements Stripe et lancement MVP

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 26 (21 + 5 export comptable)
- **Points réalisés** : -
- **Vélocité** : -

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, un artisan peut s'abonner (39€/69€/129€) et le MVP est prêt pour le lancement"**

### Critères de succès
- ✅ Intégration Stripe complète (Checkout + Webhook)
- ✅ 3 plans fonctionnels (Starter, Pro, Premium)
- ✅ Gestion des essais gratuits (14 jours)
- ✅ MVP déployé en production

---

## 📝 USER STORIES DU SPRINT

### US-040 : Stripe - Checkout abonnement
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux souscrire à un abonnement afin d'utiliser l'application sans limitation.

**Critères d'acceptation** :
- [ ] POST /billing/checkout crée session Stripe
- [ ] 3 plans : Starter (39€), Pro (69€), Premium (129€)
- [ ] Redirection vers Stripe Checkout
- [ ] Retour après paiement (success/cancel)

**Tâches** :
- [ ] Setup Stripe SDK
- [ ] Créer produits Stripe (3 plans)
- [ ] Route POST /billing/checkout
- [ ] Session Stripe Checkout
- [ ] URLs de retour
- [ ] Tests

---

### US-041 : Stripe - Webhooks
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant que système, je veux recevoir les événements Stripe afin de mettre à jour les abonnements.

**Critères d'acceptation** :
- [ ] POST /webhooks/stripe
- [ ] Vérification signature Stripe
- [ ] Événements gérés : checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- [ ] Mise à jour User.plan en DB

**Tâches** :
- [ ] Route POST /webhooks/stripe
- [ ] Vérification signature
- [ ] Handlers événements
- [ ] Update User.plan
- [ ] Tests

---

### US-042 : Gestion abonnements
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux gérer mon abonnement afin de le modifier ou annuler.

**Critères d'acceptation** :
- [ ] GET /billing/subscription retourne abonnement actuel
- [ ] POST /billing/portal redirige vers Stripe Customer Portal
- [ ] Affichage essai gratuit restant
- [ ] Restrictions features selon plan

**Tâches** :
- [ ] Route GET /billing/subscription
- [ ] Stripe Customer Portal
- [ ] Middleware check plan
- [ ] Tests

---

### US-043 : Frontend - Page Pricing
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir les offres disponibles afin de choisir mon plan.

**Critères d'acceptation** :
- [ ] Page /pricing avec 3 cartes (Starter, Pro, Premium)
- [ ] Détail features par plan
- [ ] Bouton "Essai gratuit 14 jours"
- [ ] Redirection Stripe Checkout

**Tâches** :
- [ ] Créer page Pricing
- [ ] Design 3 cartes plans
- [ ] CTA vers checkout
- [ ] Tests

---

### US-044 : Restrictions features par plan
**Points** : 5 | **Priorité** : � MUST | **Assigné à** : -

**Description** :  
En tant que système, je veux limiter les features selon le plan afin d'inciter à l'upgrade.

**Critères d'acceptation** :
- [ ] Starter : 50 recettes max, 500 ingrédients, 1 utilisateur
- [ ] Pro : recettes illimitées, ingrédients illimités, 3 utilisateurs
- [ ] Premium : tout + multi-sites + export comptable + support prioritaire, 10 utilisateurs
- [ ] Affichage message upgrade

**Tâches** :
- [ ] Middleware checkPlanLimit
- [ ] Vérification limites (recettes, ingrédients, users)
- [ ] Messages upgrade
- [ ] Tests

---

### US-045 : Préparation lancement MVP
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'équipe, nous voulons préparer le lancement MVP afin d'attirer les premiers utilisateurs.

**Critères d'acceptation** :
- [ ] Déploiement production (Vercel + Railway)
- [ ] DNS configuré
- [ ] Analytics installé (PostHog/Plausible)
- [ ] Monitoring (Sentry)
- [ ] Landing page SEO optimisée
- [ ] Documentation utilisateur complète
- [ ] Support client ready (Intercom/Crisp)

**Tâches** :
- [ ] Config DNS
- [ ] Déploiement prod
- [ ] Setup Sentry
- [ ] Setup analytics
- [ ] SEO landing page
- [ ] Docs utilisateur (guides, FAQ)
- [ ] Setup support chat
- [ ] Tests complets E2E

---

### US-046 : Export comptable CSV
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan Premium, je veux exporter mes données comptables afin de les transmettre à mon comptable.

**Critères d'acceptation** :
- [ ] GET /reports/accounting?from=2024-01-01&to=2024-12-31
- [ ] Export CSV : date, recette, quantité produite, coût matières, prix vente estimé
- [ ] Uniquement disponible pour plan Premium

**Tâches** :
- [ ] Route export accounting
- [ ] Génération CSV
- [ ] Middleware vérification plan Premium
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
- [ ] Souscription abonnement Stripe
- [ ] Gestion abonnement via Customer Portal
- [ ] MVP déployé en production

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
- ✅ **DÉPLOYÉ EN PRODUCTION**

---

## 🎉 MVP READY TO LAUNCH

- [ ] Fonctionnalités core complètes
- [ ] Tests E2E passés
- [ ] Performance validée
- [ ] Sécurité auditée
- [ ] Documentation utilisateur
- [ ] Support client ready

---

**Status** : 🔴 NOT STARTED  
**Dernière mise à jour** : 22 octobre 2025
