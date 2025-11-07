import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

console.log(`🔄 Fixing ${testFiles.length} test files...\n`);

const defaultNutrition = `calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        salt: 0,`;

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  console.log(`📝 Processing ${file}...`);
  
  // 1. Remplacer ingredientId par baseIngredientId dans RecipeIngredient
  content = content.replace(/ingredientId:/g, 'baseIngredientId:');
  content = content.replace(/unit: 'g'/g, "unit: 'G'");
  content = content.replace(/unit: 'kg'/g, "unit: 'KG'");
  content = content.replace(/unit: 'ml'/g, "unit: 'ML'");
  content = content.replace(/unit: 'L'/g, "unit: 'L'");
  content = content.replace(/unit: 'pièce'/g, "unit: 'PIECE'");
  content = content.replace(/unit: 'piece'/g, "unit: 'PIECE'");
  
  // 2. Ajouter category + nutrition si manquants
  // Chercher tous les baseIngredient.create qui n'ont PAS déjà category
  if (!content.includes('category:') && content.includes('prisma.baseIngredient.create')) {
    // Ajouter après "data: {"
    content = content.replace(
      /(prisma\.baseIngredient\.create\(\{\s*data:\s*\{)/g,
      `$1\n      category: 'AUTRE',\n      ${defaultNutrition}`
    );
    modified = true;
  }
  
  // 3. Convertir allergens string en array
  // allergens: 'gluten' => allergens: ['gluten']
  content = content.replace(/allergens: '([^']+)'/g, (match, p1) => {
    if (p1.includes(',')) {
      const items = p1.split(',').map(s => `'${s.trim()}'`).join(', ');
      return `allergens: [${items}]`;
    }
    return `allergens: ['${p1}']`;
  });
  
  // allergens: "gluten" => allergens: ['gluten']
  content = content.replace(/allergens: "([^"]+)"/g, (match, p1) => {
    if (p1.includes(',')) {
      const items = p1.split(',').map(s => `'${s.trim()}'`).join(', ');
      return `allergens: [${items}]`;
    }
    return `allergens: ['${p1}']`;
  });
  
  // 4. Convertir allergens: null en allergens: []
  content = content.replace(/allergens: null/g, 'allergens: []');
  
  if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Fixed ${file}`);
  } else {
    console.log(`  ⏭️  No changes needed for ${file}`);
  }
});

console.log(`\n✅ Fix complete! ${testFiles.length} files processed.`);
console.log(`\n🧪 Run tests: npm test`);
