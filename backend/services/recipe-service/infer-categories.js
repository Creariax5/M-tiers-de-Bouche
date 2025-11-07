import fs from 'fs';
import path from 'path';

// Mapping par mots-clés (case-insensitive, substring matching)
const CATEGORY_MAPPING = [
  { keywords: ['farine', 'flour', 'blé'], category: 'FARINES' },
  { keywords: ['beurre', 'butter'], category: 'MATIERES_GRASSES' },
  { keywords: ['sucre', 'sugar'], category: 'SUCRES' },
  { keywords: ['sel', 'salt'], category: 'CONDIMENTS' },
  { keywords: ['eau', 'water'], category: 'BOISSONS' },
  { keywords: ['viande', 'meat', 'hachée'], category: 'VIANDES' },
  { keywords: ['chocolat', 'chocolate'], category: 'PRODUITS_SUCRES' },
  { keywords: ['oeufs', 'eggs', 'œuf'], category: 'OEUFS' },
  { keywords: ['noisette', 'hazelnut'], category: 'FRUITS_SECS' },
  { keywords: ['pain'], category: 'FARINES' }, // Pain = produit à base de farine
];

function inferCategory(name) {
  const lowerName = name.toLowerCase();
  for (const { keywords, category } of CATEGORY_MAPPING) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  return 'AUTRES'; // Fallback
}

const testDir = path.join(process.cwd(), 'tests');
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

console.log(`🔄 Processing ${testFiles.length} test files...\n`);

let totalFixed = 0;

testFiles.forEach(filename => {
  const filePath = path.join(testDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  // Pattern: baseIngredient.create({ data: { (PAS de category) name: 'XXX'
  const regex = /baseIngredient\.create\(\{\s*data:\s*\{\s*\n(\s*)name:\s*['"]([^'"]+)['"]/g;

  content = content.replace(regex, (match, indent, ingredientName) => {
    const category = inferCategory(ingredientName);
    fileFixed++;
    totalFixed++;
    console.log(`  ✅ "${ingredientName}" → ${category}`);
    return `baseIngredient.create({\n${indent}  data: {\n${indent}  category: '${category}',\n${indent}name: '${ingredientName}'`;
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename}: ${fileFixed} fixed\n`);
  }
});

console.log(`\n✅ Total: ${totalFixed} categories added!`);
