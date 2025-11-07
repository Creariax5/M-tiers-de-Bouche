# Script pour ajouter category aux baseIngredient.create

$mapping = @{
    'Farine|farine|flour' = 'FARINES'
    'Beurre|beurre|butter' = 'MATIERES_GRASSES'
    'Sucre|sucre' = 'SUCRES'
    'Sel|sel' = 'CONDIMENTS'
    'Eau|eau' = 'BOISSONS'
    'Viande|viande' = 'VIANDES'
    'Chocolat|chocolat' = 'PRODUITS_SUCRES'
    'Oeufs|oeufs' = 'OEUFS'
}

$files = @(
    'tests\allergens.integration.test.js',
    'tests\pricing.integration.test.js',
    'tests\stats.integration.test.js',
    'tests\sub-recipes.integration.test.js',
    'tests\nutrition.integration.test.js'
)

foreach ($file in $files) {
    $path = "c:\proj\saas\Métiers-de-Bouche\backend\services\recipe-service\$file"
    if (-not (Test-Path $path)) {
        Write-Host "⏭️  $file not found"
        continue
    }

    $content = Get-Content $path -Raw -Encoding UTF8
    $modified = $false

    # Pour chaque ingrédient
    foreach ($namePattern in $mapping.Keys) {
        $category = $mapping[$namePattern]
        $names = $namePattern -split '\|'
        
        foreach ($name in $names) {
            # Pattern: baseIngredient.create({ data: { name: 'XXX' (sans category avant)
            $pattern = "(?<=baseIngredient\.create\(\{\s*data:\s*\{\s*)\r?\n\s*name:\s*['""]$name['""]"
            $replacement = "category: '$category',`r`n          name: '$name'"
            
            if ($content -match $pattern) {
                $content = $content -replace $pattern, $replacement
                $modified = $true
                Write-Host "  ✅ Added category for $name in $file"
            }
        }
    }

    if ($modified) {
        $content | Set-Content $path -NoNewline -Encoding UTF8
        Write-Host "✅ $file updated"
    } else {
        Write-Host "⏭️  No changes for $file"
    }
}

Write-Host "`n✅ Done!"
