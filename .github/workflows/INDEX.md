# 📚 Index des Workflows GitHub Actions

> Navigation rapide pour tous les fichiers de workflows et documentation

---

## 🎯 Démarrage Rapide

**Nouveau sur le projet ?** → Lire [ACTION_PLAN.md](./ACTION_PLAN.md) (2 min)

**Prêt à migrer ?** → Suivre [ADOPTION_CHECKLIST.md](./ADOPTION_CHECKLIST.md) (4h)

**Besoin de comprendre les gains ?** → Consulter [IMPROVEMENTS.md](./IMPROVEMENTS.md) (10 min)

---

## 📁 Structure des Fichiers

```
.github/workflows/
│
├── 📊 Workflows (YAML)
│   ├── ci-tests.yml              → ⚡ Tests CI (actuel)
│   ├── ci-improved.yml           → ✨ Tests CI (amélioré)
│   ├── docker-build.yml          → 🐳 Build Docker (actuel)
│   ├── docker-improved.yml       → ✨ Build Docker (amélioré)
│   ├── deploy-vps.yml            → 🚀 Deploy OVH (actuel)
│   ├── deploy-improved.yml       → ✨ Deploy OVH (amélioré)
│   └── metrics.yml               → 📈 Dashboard métriques (nouveau)
│
├── 📖 Documentation
│   ├── README.md                 → Vue d'ensemble
│   ├── ACTION_PLAN.md            → Plan d'action complet
│   ├── IMPROVEMENTS.md           → Guide des améliorations
│   ├── ADOPTION_CHECKLIST.md     → Checklist migration
│   ├── SECRETS_SETUP.md          → Configuration secrets
│   └── INDEX.md                  → Ce fichier
│
└── 🛠️ Outils
    └── migrate-workflows.ps1     → Script migration automatique
```

---

## 🗺️ Guide de Navigation

### Par Rôle

#### 👨‍💼 Tech Lead / CTO
1. [ACTION_PLAN.md](./ACTION_PLAN.md) - Vision stratégique, ROI, métriques
2. [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Détails techniques des améliorations
3. [metrics.yml](./metrics.yml) - Dashboard de suivi

#### 👨‍💻 Developer / DevOps
1. [ADOPTION_CHECKLIST.md](./ADOPTION_CHECKLIST.md) - Guide étape par étape
2. [SECRETS_SETUP.md](./SECRETS_SETUP.md) - Configuration infrastructure
3. [migrate-workflows.ps1](./migrate-workflows.ps1) - Script de migration
4. [ci-improved.yml](./ci-improved.yml) - Workflow CI amélioré

#### 🆕 Nouveau Membre
1. [README.md](./README.md) - Présentation générale
2. [ACTION_PLAN.md](./ACTION_PLAN.md) - Contexte et objectifs
3. [ci-tests.yml](./ci-tests.yml) - Workflow CI actuel (référence)

---

## 📝 Description des Fichiers

### Workflows Actuels (Production)

| Fichier | Status | Déclenchement | Durée | Description |
|---------|--------|---------------|-------|-------------|
| [ci-tests.yml](./ci-tests.yml) | 🟢 Actif | Push/PR sur main | 3-5 min | Lint + Tests + Health checks |
| [docker-build.yml](./docker-build.yml) | 🟢 Actif | Push/PR sur main | 5-8 min | Build 6 services Docker (matrix) |
| [deploy-vps.yml](./deploy-vps.yml) | 🟢 Actif | Push sur main | 10+ min | Déploiement OVH via SSH |

### Workflows Améliorés (Prêts à Utiliser)

| Fichier | Status | Nouveautés | Gain |
|---------|--------|------------|------|
| [ci-improved.yml](./ci-improved.yml) | 🟡 Ready | Path filtering, cache NPM, coverage | -40% temps |
| [docker-improved.yml](./docker-improved.yml) | 🟡 Ready | Multi-platform, Trivy scan, SLSA | -50% temps |
| [deploy-improved.yml](./deploy-improved.yml) | 🟡 Ready | Rollback auto, backup DB, notifications | +300% fiabilité |
| [metrics.yml](./metrics.yml) | 🟡 Ready | Dashboard quotidien, alertes | +Visibilité |

### Documentation

| Fichier | Pages | Temps Lecture | Public |
|---------|-------|---------------|--------|
| [ACTION_PLAN.md](./ACTION_PLAN.md) | 5 | 10 min | Tous |
| [IMPROVEMENTS.md](./IMPROVEMENTS.md) | 15 | 30 min | DevOps/Leads |
| [ADOPTION_CHECKLIST.md](./ADOPTION_CHECKLIST.md) | 10 | 15 min | DevOps |
| [SECRETS_SETUP.md](./SECRETS_SETUP.md) | 8 | 20 min | DevOps |
| [README.md](./README.md) | 3 | 5 min | Tous |

---

## 🎓 Parcours d'Apprentissage

### Niveau 1 : Découverte (30 min)

```
1. README.md
   ↓
2. ACTION_PLAN.md (section TL;DR)
   ↓
3. ci-tests.yml (workflow actuel)
```

**Objectif** : Comprendre l'état actuel et les objectifs

### Niveau 2 : Compréhension (2h)

```
1. IMPROVEMENTS.md (Top 10 améliorations)
   ↓
2. Comparer ci-tests.yml vs ci-improved.yml
   ↓
3. SECRETS_SETUP.md (configuration)
```

**Objectif** : Comprendre les changements techniques

### Niveau 3 : Action (4h)

```
1. ADOPTION_CHECKLIST.md (checklist complète)
   ↓
2. migrate-workflows.ps1 --backup
   ↓
3. Configurer secrets GitHub
   ↓
4. migrate-workflows.ps1 --apply
   ↓
5. Tester sur branche
```

**Objectif** : Migrer vers workflows améliorés

---

## 🔍 Recherche Rapide

### Par Sujet

**Cache & Performance**
→ [IMPROVEMENTS.md](./IMPROVEMENTS.md#3-💾-cache-multi-layer)  
→ [ci-improved.yml](./ci-improved.yml) (lignes 40-45)

**Sécurité**
→ [IMPROVEMENTS.md](./IMPROVEMENTS.md#4-🔒-scan-de-sécurité-automatique)  
→ [docker-improved.yml](./docker-improved.yml) (lignes 120-130)  
→ [SECRETS_SETUP.md](./SECRETS_SETUP.md)

**Déploiement & Rollback**
→ [IMPROVEMENTS.md](./IMPROVEMENTS.md#7-🔄-rollback-automatique)  
→ [deploy-improved.yml](./deploy-improved.yml) (lignes 90-150)

**Métriques & Monitoring**
→ [IMPROVEMENTS.md](./IMPROVEMENTS.md#📈-métriques-à-suivre)  
→ [metrics.yml](./metrics.yml)

**Migration**
→ [ADOPTION_CHECKLIST.md](./ADOPTION_CHECKLIST.md)  
→ [migrate-workflows.ps1](./migrate-workflows.ps1)

### Par Problème

**"Mes workflows sont trop lents"**
→ [IMPROVEMENTS.md](./IMPROVEMENTS.md#1-⚡-détection-intelligente-des-changements)

**"J'ai des failles de sécurité"**
→ [docker-improved.yml](./docker-improved.yml) (Trivy scan)

**"Mes déploiements échouent"**
→ [deploy-improved.yml](./deploy-improved.yml) (rollback automatique)

**"Je n'ai pas de visibilité"**
→ [metrics.yml](./metrics.yml) (dashboard quotidien)

---

## 📊 Matrice de Décision

### Dois-je migrer maintenant ?

| Situation | Recommandation |
|-----------|----------------|
| Projet en démarrage | ✅ Adopter workflows améliorés directement |
| Projet en prod stable | 🟡 Tester sur branche develop d'abord |
| Incident récent | ❌ Attendre période calme |
| Équipe surchargée | 🟡 Migration progressive (1 workflow/semaine) |
| Pipeline cassé | ✅ Bonne occasion de refactor complet |

### Quelle stratégie ?

| Si... | Alors... | Durée |
|-------|----------|-------|
| Équipe < 3 personnes | Migration Big Bang | 4h |
| Équipe > 3 personnes | Migration Progressive | 2 semaines |
| Deadline proche | Reporter après release | N/A |
| Temps disponible | Suivre ADOPTION_CHECKLIST | 1 semaine |

---

## 🆘 Aide Rapide

### Commandes Essentielles

```powershell
# Backup workflows actuels
.\.github\workflows\migrate-workflows.ps1 --backup

# Appliquer améliorations
.\.github\workflows\migrate-workflows.ps1 --apply

# Rollback si problème
.\.github\workflows\migrate-workflows.ps1 --rollback

# Analyser workflows
.\.github\workflows\migrate-workflows.ps1 --help
```

### Liens Utiles

- 🐛 [Issues GitHub](https://github.com/Creariax5/M-tiers-de-Bouche/issues)
- 💬 [Discussions](https://github.com/Creariax5/M-tiers-de-Bouche/discussions)
- 📚 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 🐳 [Docker Actions](https://github.com/docker/build-push-action)

---

## ✅ Checklist Rapide

Avant de commencer :

- [ ] Lire [ACTION_PLAN.md](./ACTION_PLAN.md)
- [ ] Backup workflows actuels
- [ ] Configurer secrets GitHub
- [ ] Tester sur branche

Après migration :

- [ ] Tous les workflows passent
- [ ] Métriques collectées
- [ ] Équipe formée
- [ ] Documentation mise à jour

---

## 🎯 Prochaines Étapes

1. **Aujourd'hui** : Lire [ACTION_PLAN.md](./ACTION_PLAN.md) (10 min)
2. **Cette semaine** : Suivre [ADOPTION_CHECKLIST.md](./ADOPTION_CHECKLIST.md) (4h)
3. **Semaine prochaine** : Monitoring avec [metrics.yml](./metrics.yml)
4. **Dans 1 mois** : Optimisations supplémentaires

---

**Dernière mise à jour**: 2025-12-18  
**Version**: 1.0.0  
**Mainteneur**: @Creariax5

**Questions ?** → Ouvrir une [Discussion GitHub](https://github.com/Creariax5/M-tiers-de-Bouche/discussions)
