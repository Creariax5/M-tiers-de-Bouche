# 🚀 SPRINT 3 : Label Service & PDF Generation
**Durée** : 2 semaines (Semaines 6-7)  
**Dates** : 11 Décembre 2025 - 25 Décembre 2025
**Sprint Goal** : Génération automatique d'étiquettes conformes à la réglementation

---

## 📊 CAPACITÉ & VÉLOCITÉ

- **Points planifiés** : 42 (34 + 8 impression imprimantes)
- **Points réalisés** : -
- **Vélocité** : -

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
- [ ] POST /labels/generate
- [ ] PDF généré avec PDFKit ou Puppeteer
- [ ] Contenu : nom produit, ingrédients (ordre décroissant), allergènes EN GRAS, valeurs nutritionnelles (100g)
- [ ] Mentions obligatoires : date fabrication, DLUO, poids net, conditions conservation, fabricant (nom + adresse)
- [ ] Format A4 ou étiquettes (40x30, 50x30, 70x50mm)
- [ ] Stockage MinIO (bucket labels)

**Tâches** :
- [ ] Créer label-service
- [ ] Template avec TOUS les champs obligatoires
- [ ] Génération PDF conforme INCO
- [ ] Upload vers MinIO
- [ ] Tests

---

### US-029 : Templates d'étiquettes
**Points** : 8 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux choisir un template d'étiquette afin de personnaliser le design.

**Critères d'acceptation** :
- [ ] 3 templates prédéfinis (Moderne, Classique, Minimaliste)
- [ ] Sélection template dans formulaire
- [ ] Preview du template

**Tâches** :
- [ ] Créer 3 templates HTML/CSS
- [ ] Paramètre template dans génération PDF
- [ ] Tests

---

### US-030 : Conformité réglementaire INCO
**Points** : 5 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux que mes étiquettes soient conformes à la réglementation INCO afin d'éviter des amendes.

**Critères d'acceptation** :
- [ ] Allergènes en GRAS ou CAPITALES
- [ ] Valeurs nutritionnelles pour 100g (tableau obligatoire)
- [ ] Ingrédients par ordre décroissant de poids
- [ ] Mentions obligatoires : date fabrication, DLUO, poids net, conditions conservation, nom et adresse fabricant
- [ ] Validation selon Règlement UE n°1169/2011

**Tâches** :
- [ ] Validator conformité INCO complet
- [ ] Tri automatique ingrédients par poids
- [ ] Règles de formatage allergènes
- [ ] Tests conformité avec cas réels

---

### US-031 : Historique des étiquettes
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux retrouver mes étiquettes générées afin de les réimprimer.

**Critères d'acceptation** :
- [ ] GET /labels liste mes étiquettes
- [ ] Stockage lien MinIO en DB
- [ ] Téléchargement depuis historique

**Tâches** :
- [ ] Schema Label en DB
- [ ] Route GET /labels
- [ ] Lien vers fichier MinIO
- [ ] Tests

---

### US-032 : Frontend - Génération étiquette
**Points** : 8 | **Priorité** : 🔴 MUST | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux générer une étiquette depuis la page recette afin de gagner du temps.

**Critères d'acceptation** :
- [ ] Bouton "Générer étiquette" sur page recette
- [ ] Modal de configuration (template, format)
- [ ] Preview PDF
- [ ] Téléchargement PDF

**Tâches** :
- [ ] Bouton + modal génération
- [ ] Preview PDF dans iframe
- [ ] Download PDF
- [ ] Tests

---

### US-033 : Frontend - Historique étiquettes
**Points** : 5 | **Priorité** : 🟡 SHOULD | **Assigné à** : -

**Description** :  
En tant qu'artisan, je veux voir mes étiquettes générées afin de les télécharger à nouveau.

**Critères d'acceptation** :
- [ ] Page /labels
- [ ] Liste étiquettes avec miniature
- [ ] Téléchargement
- [ ] Impression directe

**Tâches** :
- [ ] Créer page Labels
- [ ] Liste avec preview
- [ ] Bouton impression directe
- [ ] Tests

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

**Status** : 🔴 NOT STARTED  
**Dernière mise à jour** : 22 octobre 2025
