# 📋 CAHIER DES CHARGES COMPLET
## SaaS de Gestion pour Métiers de Bouche

---

## 🎯 1. CONTEXTE ET OPPORTUNITÉ

### Marché cible
Artisans des métiers de bouche : pâtissiers, boulangers, chocolatiers, traiteurs, glaciers, confiseurs

### Problème identifié
- **Temps énorme perdu** sur les fiches techniques (2-3h par recette)
- **Obligation légale** : HACCP + déclaration allergènes (risque de sanctions)
- **Pas d'avis clients** sur Quantara malgré son existence depuis 2016
- **Marché sous-digitalisé** : beaucoup travaillent encore sur papier/Excel
- **Complexité réglementaire** croissante (14 allergènes obligatoires, traçabilité, valeurs nutritionnelles)

### Concurrents identifiés
- Quantara Software (70k€ CA, peu d'avis)
- CommisSoft (solution desktop, interface datée)
- Lumis Traiteurs (focus gestion commandes)
- MdB Multimédia (FTBE Pro/Standard)
- Otami (récent, focus automatisation)

---

## 🎯 2. OBJECTIFS DU PROJET

### Vision
Devenir le logiciel n°1 des artisans pour gagner 85-90% du temps sur les obligations réglementaires

### Objectifs business
- **Cible année 1** : 100 clients payants (40-80€/mois)
- **CA visé** : 48k-96k€ annuel
- **Churn max** : <5% mensuel
- **Temps d'onboarding** : <2h pour être opérationnel

---

## 💡 3. FONCTIONNALITÉS CORE (MVP - Phase 1)

### 3.1 Gestion des Fiches Techniques
**Besoin** : Créer des fiches techniques conformes HACCP en 10 min au lieu de 2-3h

**Fonctionnalités** :
- ✅ Création de recettes avec ingrédients
- ✅ Calcul automatique des allergènes (14 ADO obligatoires)
- ✅ Calcul automatique des valeurs nutritionnelles (calories, protéines, lipides, glucides, sel)
- ✅ Gestion des sous-recettes (compositions)
- ✅ Calcul du coût de revient en temps réel
- ✅ Suggestion de prix de vente (avec coefficient configurable)
- ✅ Gestion des pertes/chutes (coefficient par ingrédient)
- ✅ Import d'ingrédients depuis base de données nutritionnelle (Ciqual ANSES)

**Champs obligatoires pour chaque recette** :
- Nom de la recette
- Catégorie (pâtisserie, viennoiserie, chocolaterie, etc.)
- Liste des ingrédients avec quantités
- Nombre de portions
- Temps de préparation/cuisson
- Instructions (optionnel)
- Photo (optionnel)

### 3.2 Génération d'Étiquettes Réglementaires
**Besoin** : Imprimer des étiquettes conformes sans effort

**Fonctionnalités** :
- ✅ Génération automatique d'étiquettes avec :
  - Nom du produit
  - Liste d'ingrédients (mise en avant des allergènes en GRAS)
  - Valeurs nutritionnelles (pour 100g)
  - Date de fabrication / DLUO
  - Poids net
  - Nom et adresse du fabricant
  - Conditions de conservation
- ✅ Formats d'étiquettes multiples (40x30mm, 50x30mm, 70x50mm, A4, personnalisé)
- ✅ Export PDF pour impression
- ✅ Modèles d'étiquettes personnalisables (logo, couleurs)
- ✅ Impression directe (compatible imprimantes étiquettes Zebra, Brother)

### 3.3 Base de Données Ingrédients
**Fonctionnalités** :
- ✅ Base pré-remplie avec 1000+ ingrédients communs
- ✅ Import depuis base Ciqual ANSES (valeurs nutritionnelles officielles)
- ✅ Ajout d'ingrédients personnalisés
- ✅ Gestion des fournisseurs par ingrédient
- ✅ Prix d'achat par unité (kg, L, pièce)
- ✅ Traçabilité : lot, DLUO, DLC
- ✅ Catégorisation (farines, sucres, matières grasses, etc.)

### 3.4 Gestion de Production
**Besoin** : Savoir quoi produire et en quelle quantité

**Fonctionnalités** :
- ✅ Planning de production hebdomadaire
- ✅ Calcul automatique des quantités d'ingrédients nécessaires
- ✅ Liste de courses/commandes fournisseurs
- ✅ Bon d'économat (sortie de stock)
- ✅ Fiches de fabrication imprimables pour le labo

---

## 🚀 4. FONCTIONNALITÉS AVANCÉES (Phase 2-3)

### 4.1 Gestion des Stocks
- Inventaire en temps réel
- Alertes de réapprovisionnement
- Gestion des DLC/DLUO
- Traçabilité complète (entrées/sorties)
- Valorisation du stock

### 4.2 Gestion des Commandes Clients
- Prise de commande (Click & Collect ou sur place)
- Calendrier des commandes
- Fiches récapitulatives par date/client/produit
- Envoi SMS/Email de confirmation
- Facturation simple

### 4.3 Analyses & Statistiques
- Top 10 des produits les plus rentables
- Évolution des coûts matières
- Analyse des marges par catégorie
- Suivi du CA mensuel
- Export comptable (CSV)

### 4.4 Multilingue & Export
- Traduction automatique des fiches techniques
- Export en plusieurs langues (anglais, allemand, italien)
- Utile pour export ou tourisme

### 4.5 Gestion Multi-sites
- Plusieurs boutiques/laboratoires
- Synchronisation des recettes
- Stocks séparés par site

---

## 🎨 5. SPECIFICATIONS TECHNIQUES

### 5.1 Architecture
**Type** : SaaS (Software as a Service) 100% cloud

**Stack technique recommandée** :
- **Frontend** : React + TypeScript + TailwindCSS
- **Backend** : Node.js + Express (ou Python + FastAPI)
- **Base de données** : PostgreSQL
- **Hébergement** : AWS / Vercel / Heroku
- **Stockage fichiers** : AWS S3 (photos, PDFs)
- **Authentification** : Auth0 ou JWT custom

### 5.2 Compatibilité
- ✅ Web responsive (desktop + tablette)
- ✅ Mobile-friendly pour consultation
- ✅ Compatible tous navigateurs modernes
- ✅ Pas d'application mobile native (Phase 1)

### 5.3 Performance
- Temps de chargement : <2 secondes
- Disponibilité : 99.5% (SLA)
- Sauvegarde automatique toutes les 24h
- Backup manuel à la demande

### 5.4 Sécurité & Conformité
- ✅ **RGPD compliant**
- ✅ Chiffrement des données (SSL/TLS)
- ✅ Authentification sécurisée
- ✅ Logs d'activité
- ✅ Export des données utilisateur (droit à la portabilité)
- ✅ Hébergement données en Europe (RGPD)

---

## 💰 6. MODÈLE ÉCONOMIQUE

### 6.1 Pricing
**Stratégie** : Tarification simple, 3 paliers

| **Offre** | **Prix/mois** | **Fonctionnalités** | **Cible** |
|-----------|---------------|---------------------|-----------|
| **Starter** | 39€ | 50 recettes, 500 ingrédients, étiquettes illimitées, 1 utilisateur | Artisans solo |
| **Pro** | 69€ | Recettes illimitées, ingrédients illimités, gestion stocks, 3 utilisateurs | PME 2-5 personnes |
| **Premium** | 129€ | Tout Pro + multi-sites, exports comptables, support prioritaire, 10 utilisateurs | Chaînes/franchises |

**Options** :
- ✅ Paiement annuel : -20% (fidélisation)
- ✅ Essai gratuit 14 jours (sans CB)
- ✅ Pas de frais d'installation
- ✅ Formation incluse (1h en visio)

### 6.2 Coûts estimés
**Développement MVP** :
- Développeur full-stack (2-3 mois) : 15-25k€
- Design UI/UX : 3-5k€
- Base de données ingrédients : 2k€

**Coûts mensuels** :
- Hébergement : 50-100€/mois
- Outils (Stripe, email, etc.) : 100€/mois
- Support client (temps) : variable

---

## 📊 7. PARCOURS UTILISATEUR (UX)

### 7.1 Onboarding (première utilisation)
1. **Inscription** (nom, email, mot de passe, type de commerce)
2. **Configuration** :
   - Informations entreprise (nom, adresse, logo)
   - Marges par défaut (coeff multiplicateur)
   - Unités préférées (kg, g, L, ml)
3. **Import/Création de 3 premières recettes** (guidé)
4. **Génération de la première étiquette** (démo)
5. **✅ Onboarding terminé en <30 min**

### 7.2 Workflow quotidien
**Scénario type** : Création d'une nouvelle recette

1. Clic sur "Nouvelle recette"
2. Saisie du nom (ex: "Tarte citron meringuée")
3. Ajout des ingrédients via recherche intelligente
   - Ex: taper "fari" → autocomplétion "Farine T55, Farine T65..."
   - Sélectionner quantité + unité
4. **Calcul automatique en temps réel** :
   - Allergènes détectés
   - Valeurs nutritionnelles calculées
   - Coût de revient affiché
5. Génération de l'étiquette en 1 clic
6. **Total : <10 minutes**

---

## 🎯 8. DIFFÉRENCIATEURS vs CONCURRENCE

| **Critère** | **Notre SaaS** | **Quantara** | **Autres** |
|-------------|----------------|--------------|------------|
| **Temps création fiche** | 10 min | 30-45 min | 1-2h |
| **Base ingrédients pré-remplie** | ✅ 1000+ | ❌ Vide | Variable |
| **Interface moderne** | ✅ 2024 | ⚠️ 2016 | ❌ 2010 |
| **Onboarding guidé** | ✅ 30 min | ❌ Débrouillez-vous | ❌ |
| **Mobile-friendly** | ✅ Oui | ⚠️ Partiel | ❌ Non |
| **Prix transparent** | ✅ Affiché | ❌ Sur demande | Variable |
| **Essai gratuit sans CB** | ✅ 14 jours | ⚠️ Démo | Rare |
| **Support réactif** | ✅ <24h | ⚠️ Inconnu | Variable |

---

## 📈 9. STRATÉGIE DE LANCEMENT

### 9.1 Phase de Validation (Avant dev)
**Durée** : 2-4 semaines

1. **Interviews clients** (10-15 artisans)
   - Groupes Facebook métiers de bouche
   - Salons professionnels (Europain, Sirha)
   - Chambres des Métiers

2. **Landing page + pré-ventes**
   - Offre early bird : -50% à vie
   - Objectif : 30 pré-inscriptions = GO

### 9.2 Développement MVP
**Durée** : 2-3 mois
- Sprint 1 : Gestion recettes + calculs
- Sprint 2 : Étiquettes + impressions
- Sprint 3 : Base ingrédients + interface
- Sprint 4 : Tests utilisateurs + corrections

### 9.3 Lancement Beta
**Durée** : 1-2 mois
- 20-30 beta-testeurs (pré-inscrits)
- Feedback hebdomadaire
- Corrections bugs critiques
- Témoignages vidéo

### 9.4 Lancement Public
**Canaux d'acquisition** :
1. **SEO** : Blog + guides (ex: "Comment calculer le prix de revient")
2. **Facebook Ads** : Ciblage métiers de bouche
3. **Partenariats** : Fournisseurs (Meilleur du Chef, G. Detou)
4. **Salons pro** : Stand + démos
5. **Bouche-à-oreille** : Programme de parrainage (1 mois offert)

---

## ✅ 10. CRITÈRES DE SUCCÈS

**Métriques à suivre** :
- **MRR** (Monthly Recurring Revenue) : objectif 5k€/mois à M6
- **Nombre de clients actifs** : 100 à M12
- **Churn rate** : <5%/mois
- **NPS** (Net Promoter Score) : >50
- **Temps moyen de création fiche technique** : <15 min
- **Taux de conversion essai→payant** : >30%

---

## 🚨 11. RISQUES & MITIGATION

| **Risque** | **Impact** | **Probabilité** | **Mitigation** |
|------------|-----------|----------------|----------------|
| Réglementation change | Élevé | Moyen | Veille réglementaire, updates rapides |
| Concurrence agressive | Moyen | Faible | Différenciation forte, pricing agressif |
| Adoption lente (papier) | Élevé | Élevé | Onboarding ultra-simple, support fort |
| Bugs calculs nutritionnels | Critique | Faible | Tests automatisés, validation experts |
| Churn élevé | Élevé | Moyen | Engagement utilisateur, nouvelles features |

---

## 📞 12. BESOINS RESSOURCES

### Équipe minimum
- 1 Développeur full-stack (ou vous)
- 1 Designer UI/UX (freelance OK)
- 1 Expert métier (pâtissier conseil, 5-10h)

### Outils nécessaires
- Figma (design)
- GitHub (code)
- Stripe (paiements)
- Intercom ou Crisp (support chat)
- Google Analytics (metrics)

### Budget total estimé
**20-35k€** (MVP + 6 mois opération)

---

## 🎯 NEXT STEPS IMMÉDIATS

1. **✅ Valider l'intérêt** : 10 interviews artisans (1-2 semaines)
2. **✅ Créer landing page** : Pitch + email capture (2-3 jours)
3. **✅ Tester pricing** : Sondage "Combien paieriez-vous ?" (1 semaine)
4. **✅ Mockups interface** : Figma des 3 écrans principaux (1 semaine)
5. **🚀 Décision GO/NO-GO**
