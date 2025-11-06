# Script PowerShell pour lancer les tests frontend via Docker
# Usage: .\test-frontend.ps1

Write-Host "🧪 Lancement des tests frontend..." -ForegroundColor Cyan

docker run --rm `
  -v "${PWD}/frontend:/app" `
  -w /app `
  node:20-alpine `
  sh -c "npm install && npm test -- --run"

Write-Host "`n✅ Tests terminés !" -ForegroundColor Green
