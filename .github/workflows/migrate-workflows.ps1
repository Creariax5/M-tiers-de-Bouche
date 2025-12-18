#!/usr/bin/env pwsh
# ========================================
# Migration vers Workflows Améliorés
# ========================================
# Usage: .\migrate-workflows.ps1 [--backup] [--apply] [--rollback]

param(
    [switch]$Backup,
    [switch]$Apply,
    [switch]$Rollback,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

# Couleurs
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Cyan }
function Write-Warning-Custom { Write-Host "⚠️  $args" -ForegroundColor Yellow }

# Banner
function Show-Banner {
    Write-Host @"
╔════════════════════════════════════════════════════════╗
║   🚀 Migration Workflows GitHub Actions                ║
║   Métiers de Bouche - Infrastructure Upgrade           ║
╚════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

# Aide
function Show-Help {
    Write-Host @"

Usage:
  .\migrate-workflows.ps1 --backup        # Sauvegarder les workflows actuels
  .\migrate-workflows.ps1 --apply         # Appliquer les nouveaux workflows
  .\migrate-workflows.ps1 --rollback      # Restaurer les anciens workflows
  .\migrate-workflows.ps1 --help          # Afficher cette aide

Étapes recommandées:
  1. .\migrate-workflows.ps1 --backup     # Sauvegarder
  2. .\migrate-workflows.ps1 --apply      # Appliquer
  3. git add .github/workflows/
  4. git commit -m "feat(ci): amélioration workflows"
  5. git push origin feat/improve-ci
  6. Créer PR et tester
  7. Si problème: .\migrate-workflows.ps1 --rollback

"@
}

# Vérifications préliminaires
function Test-Prerequisites {
    Write-Info "Vérification des prérequis..."
    
    # Git
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "Git non installé"
        exit 1
    }
    
    # Dans un repo Git
    if (-not (Test-Path .git)) {
        Write-Error-Custom "Pas dans un repository Git"
        exit 1
    }
    
    # Workflows directory exists
    if (-not (Test-Path .github/workflows)) {
        Write-Error-Custom "Dossier .github/workflows introuvable"
        exit 1
    }
    
    Write-Success "Prérequis OK"
}

# Backup
function Backup-Workflows {
    Write-Info "Sauvegarde des workflows actuels..."
    
    $backupDir = ".github/workflows.backup.$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
    
    if (Test-Path .github/workflows) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Copy-Item -Path .github/workflows/* -Destination $backupDir -Recurse
        
        Write-Success "Backup créé: $backupDir"
        return $backupDir
    } else {
        Write-Error-Custom "Dossier workflows introuvable"
        exit 1
    }
}

# Apply
function Apply-Workflows {
    Write-Info "Application des nouveaux workflows..."
    
    $workflows = @{
        "ci-improved.yml" = "ci-tests.yml"
        "docker-improved.yml" = "docker-build.yml"
        "deploy-improved.yml" = "deploy-vps.yml"
    }
    
    $workflowsDir = ".github/workflows"
    
    foreach ($source in $workflows.Keys) {
        $target = $workflows[$source]
        $sourcePath = Join-Path $workflowsDir $source
        $targetPath = Join-Path $workflowsDir $target
        
        if (Test-Path $sourcePath) {
            Write-Info "Remplacement: $target"
            Copy-Item -Path $sourcePath -Destination $targetPath -Force
            Write-Success "$target mis à jour"
        } else {
            Write-Warning-Custom "Fichier source introuvable: $source"
        }
    }
    
    Write-Success "Workflows appliqués avec succès"
    
    # Instructions suivantes
    Write-Host @"

📋 Prochaines étapes:

1. Vérifier les changements:
   git status
   git diff .github/workflows/

2. Tester localement (optionnel):
   act -j lint-backend

3. Créer une branche et commit:
   git checkout -b feat/improve-ci
   git add .github/workflows/
   git commit -m "feat(ci): amélioration workflows GitHub Actions

   - Détection changements intelligente
   - Cache multi-layer
   - Scan sécurité Trivy
   - Rollback automatique
   - Notifications Discord
   - Tests post-déploiement"
   
4. Push et créer PR:
   git push origin feat/improve-ci

5. Configurer les secrets GitHub:
   - VPS_HOST
   - VPS_USER
   - VPS_SSH_KEY
   - DISCORD_WEBHOOK (optionnel)
   
   Voir: .github/workflows/SECRETS_SETUP.md

6. Merger si tests OK

"@ -ForegroundColor Yellow
}

# Rollback
function Restore-Workflows {
    Write-Info "Recherche du backup le plus récent..."
    
    $backups = Get-ChildItem -Path .github -Filter "workflows.backup.*" -Directory | 
               Sort-Object Name -Descending
    
    if ($backups.Count -eq 0) {
        Write-Error-Custom "Aucun backup trouvé"
        exit 1
    }
    
    $latestBackup = $backups[0]
    Write-Info "Backup trouvé: $($latestBackup.Name)"
    
    # Confirmation
    $confirm = Read-Host "Restaurer depuis ce backup? (y/N)"
    if ($confirm -ne "y") {
        Write-Warning-Custom "Rollback annulé"
        exit 0
    }
    
    # Restaurer
    Write-Info "Restauration des workflows..."
    Remove-Item -Path .github/workflows/*.yml -Force
    Copy-Item -Path "$($latestBackup.FullName)/*" -Destination .github/workflows/ -Recurse
    
    Write-Success "Workflows restaurés depuis $($latestBackup.Name)"
    Write-Info "Pensez à commit les changements"
}

# Analyse des workflows
function Show-WorkflowAnalysis {
    Write-Host "`n📊 Analyse des Workflows" -ForegroundColor Cyan
    Write-Host "════════════════════════════════" -ForegroundColor Cyan
    
    $workflows = Get-ChildItem .github/workflows/*.yml
    
    foreach ($workflow in $workflows) {
        $content = Get-Content $workflow.FullName -Raw
        
        Write-Host "`n📄 $($workflow.Name)" -ForegroundColor Yellow
        
        # Détecter les features
        $features = @()
        if ($content -match "dorny/paths-filter") { $features += "✅ Path filtering" }
        if ($content -match "concurrency:") { $features += "✅ Concurrency control" }
        if ($content -match "cache-from.*gha") { $features += "✅ GitHub Actions cache" }
        if ($content -match "trivy") { $features += "✅ Security scanning" }
        if ($content -match "discord") { $features += "✅ Notifications" }
        if ($content -match "rollback") { $features += "✅ Auto rollback" }
        if ($content -match "linux/arm64") { $features += "✅ Multi-platform" }
        
        if ($features.Count -gt 0) {
            $features | ForEach-Object { Write-Host "  $_" }
        } else {
            Write-Host "  ⚠️  Workflow basique (aucune feature avancée)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# Main
Show-Banner

if ($Help -or (-not $Backup -and -not $Apply -and -not $Rollback)) {
    Show-Help
    exit 0
}

Test-Prerequisites

if ($Backup) {
    Backup-Workflows
}

if ($Apply) {
    # Auto-backup avant apply
    if (-not $Backup) {
        Write-Warning-Custom "Création d'un backup automatique avant application..."
        Backup-Workflows
    }
    
    Apply-Workflows
    Show-WorkflowAnalysis
}

if ($Rollback) {
    Restore-Workflows
}

Write-Success "Script terminé avec succès"
