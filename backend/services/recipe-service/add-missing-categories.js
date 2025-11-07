import fs from 'fs';
import path from 'path';

const INGREDIENT_CATEGORIES = {
  'Farine': 'FARINES',
  'farine': 'FARINES',
  'flour': 'FARINES',
  'Beurre': 'MATIERES_GRASSES',
  'beurre': 'MATIERES_GRASSES',
  'butter': 'MATIERES_GRASSES',
  'Sucre': 'SUCRES',
  'sucre': 'SUCRES',
  'Sel': 'CONDIMENTS',
  'sel': 'CONDIMENTS',
  'Eau': 'BOISSONS',
  'eau': 'BOISSONS',
  'Viande': 'VIANDES',
  'viande': 'VIANDES',
  'Chocolat': 'PRODUITS_SUCRES',
  'chocolat': 'PRODUITS_SUCRES',
  'Oeufs': 'OEUFS',
  'oeufs': 'OEUFS',
};

const testDir = path.join(process.cwd(), 'tests');
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

console.log(`🔄 Processing ${testFiles.length} test files...\n`);

testFiles.forEach(filename => {
  const filePath = path.join(testDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pour chaque ingrédient
  Object.keys(INGREDIENT_CATEGORIES).forEach(ingredientName => {
    const category = INGREDIENT_CATEGORIES[ingredientName];
    
    // Pattern: baseIngredient.create({ data: { \n          name: 'XXX'
    // SANS category: avant name
    const regex = new RegExp(
      `(baseIngredient\\.create\\(\\{\\s*data:\\s*\\{)\\s*\\n(\\s*)name:\\s*['"]${ingredientName}['"]`,
      'g'
    );

    const replacement = `$1\n$2category: '${category}',\n$2name: '${ingredientName}'`;

    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
      console.log(`  ✅ Added category for ${ingredientName} in ${filename}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename} updated\n`);
  }
});

console.log('✅ Done!');
