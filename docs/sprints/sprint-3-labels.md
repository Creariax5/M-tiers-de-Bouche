# 🚀 SPRINT 3 : Label Service & PDF Generation
**Durée** : 2 semaines (Semaines 6-7)  
**Dates** : 11 Décembre 2025 - 25 Décembre 2025
**Sprint Goal** : Génération automatique d'étiquettes conformes à la réglementation

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 42 (34 + 8 impression imprimantes)
- **Points réalisés** : 44
- **Vélocité** : 44

---

## 🎯 OBJECTIF DU SPRINT

> **"À la fin de ce sprint, un artisan peut générer une étiquette PDF conforme (INCO) en 1 clic"**

### Critères de succès
- ✅ Génération PDF étiquette fonctionnelle
- ✅ Conformité réglementaire INCO vérifiée
- ✅ Templates personnalisables
- ✅ Preview avant téléchargement

---

## 📝 USER STORIES DU SPRINT

### US-028 : Label Service - Génération PDF
**Points** : 13 | **Priorité** : 🔴 MUST | **Assigné à** : GitHub Copilot

**Description** :  
En tant qu'artisan, je veux générer une étiquette PDF afin de l'imprimer pour mes produits.

**Critères d'acceptation** :
- [x] POST /labels/generate
- [x] PDF généré avec PDFKit ou Puppeteer
- [x] Contenu : nom produit, ingrédients (ordre décroissant), allergènes EN GRAS, valeurs nutritionnelles (100g)
- [x] Mentions obligatoires : date fabrication, DLUO, poids net, conditions conservation, fabricant (nom + adresse)
- [x] Format A4 ou étiquettes (40x30, 50x30, 70x50mm)
- [x] Stockage MinIO (bucket labels)

**Tâches** :
- [x] Créer label-service
- [x] Template avec TOUS les champs obligatoires
- [x] Génération PDF conforme INCO
- [x] Upload vers MinIO
- [x] Tests

---

### US-029 : Templates d'étiquettes
**Points** : 8 | **Priorité** : 🟡 SHOULD | **Assigné à** : GitHub Copilot

**Description** :  
En tant qu'artisan, je veux choisir un template d'étiquette afin de personnaliser le design.

**Critères d'acceptation** :
- [x] 3 templates prédéfinis (Moderne, Classique, Minimaliste)
- [x] Sélection template dans formulaire
- [x] Preview du template

**Tâches** :
- [x] Créer 3 templates HTML/CSS
- [x] Paramètre template dans génération PDF
- [x] Tests

---

### US-030 : Conformité réglementaire INCO
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : GitHub Copilot

**Description** :  
En tant qu'artisan, je veux que mes étiquettes soient conformes à la réglementation INCO afin d'éviter des amendes.

**Critères d'acceptation** :
- [x] Allergènes en GRAS ou CAPITALES
- [x] Valeurs nutritionnelles pour 100g (tableau obligatoire)
- [x] Ingrédients par ordre décroissant de poids
- [x] Mentions obligatoires : date fabrication, DLUO, poids net, conditions conservation, nom et adresse fabricant
- [x] Validation selon Règlement UE n°1169/2011

**Tâches** :
- [x] Validator conformité INCO complet
- [x] Tri automatique ingrédients par poids
- [x] Règles de formatage allergènes
- [x] Tests conformité avec cas réels

---

### US-031 : Historique des étiquettes
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : GitHub Copilot

**Description** :  
En tant qu'artisan, je veux retrouver mes étiquettes générées afin de les réimprimer.

**Critères d'acceptation** :
- [x] GET /labels liste mes étiquettes
- [x] Stockage lien MinIO en DB

**Tâches** :
- [x] Modèle Prisma Label
- [x] Endpoint GET /labels
- [x] Tests intégration
- [ ] Téléchargement depuis historique

**Tâches** :
- [ ] Schema Label en DB
- [ ] Route GET /labels
- [ ] Lien vers fichier MinIO
- [ ] Tests

---

### US-032 : Frontend - Génération étiquette
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : GitHub Copilot

**Description** :  
En tant qu'artisan, je veux générer une étiquette depuis la page recette afin de gagner du temps.

**Critères d'acceptation** :
- [x] Bouton "Générer étiquette" sur page recette
- [x] Modal de configuration (template, format)
- [x] Preview PDF
- [x] Téléchargement PDF

**Tâches** :
- [x] Bouton + modal génération
- [x] Preview PDF dans iframe
- [x] Download PDF
- [x] Tests

---

### US-033 : Frontend - Historique étiquettes
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : GitHub Copilot

**Description** :  
En tant qu'artisan, je veux voir mes étiquettes générées afin de les télécharger à nouveau.

**Critères d'acceptation** :
- [x] Page /labels
- [x] Liste étiquettes avec miniature
- [x] Téléchargement
- [ ] Impression directe

**Tâches** :
- [x] Créer page Labels
- [x] Liste avec preview
- [ ] Bouton impression directe
- [x] Tests

---

### US-034-bis : Support impression imprimantes étiquettes
**Points** : 8 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux imprimer directement sur mon imprimante à étiquettes afin de gagner du temps.

**Critères d'acceptation** :
- [ ] Support imprimantes Zebra (ZPL)
- [ ] Support imprimantes Brother
- [ ] Configuration imprimante dans profil utilisateur
- [ ] Bouton "Imprimer" envoie vers imprimante

**Tâches** :
- [ ] Recherche formats Zebra ZPL et Brother
- [ ] Conversion PDF → ZPL
- [ ] Configuration imprimante dans settings
- [ ] Tests avec imprimantes physiques

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
- [ ] Génération étiquette PDF conforme
- [ ] Sélection template
- [ ] Téléchargement et historique

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
**Dernière mise à jour** : 11 Décembre 2025
