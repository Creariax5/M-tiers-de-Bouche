import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testsDir = path.join(__dirname, 'tests');

// Lire tous les fichiers .test.js
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

console.log(`🔄 Migrating ${testFiles.length} test files...\n`);

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`📝 Processing ${file}...`);
  
  // 1. Remplacer prisma.ingredient par prisma.baseIngredient
  content = content.replace(/prisma\.ingredient\./g, 'prisma.baseIngredient.');
  
  // 2. Remplacer ingredientId par baseIngredientId
  content = content.replace(/ingredientId:/g, 'baseIngredientId:');
  
  // 3. Convertir unit strings en enum
  content = content.replace(/unit: 'g'/g, "unit: 'G'");
  content = content.replace(/unit: 'kg'/g, "unit: 'KG'");
  content = content.replace(/unit: 'ml'/g, "unit: 'ML'");
  content = content.replace(/unit: 'L'/g, "unit: 'L'");
  content = content.replace(/unit: 'pièce'/g, "unit: 'PIECE'");
  content = content.replace(/unit: 'piece'/g, "unit: 'PIECE'");
  
  // 4. Supprimer userId: 'system' (BaseIngredient n'a pas userId)
  content = content.replace(/userId: 'system',\s*/g, '');
  content = content.replace(/userId: 'user-\d+',\s*/g, '');
  
  // 5. Ajouter category avant name si manquant
  // Match: baseIngredient.create({ data: { name:
  content = content.replace(
    /(baseIngredient\.create\(\{\s*data:\s*\{)\s*name:/g,
    '$1\n        category: \'AUTRE\',\n        name:'
  );
  
  // 6. Convertir allergens string en array
  // "gluten" -> ["gluten"]
  content = content.replace(/allergens: "([^"]+)"/g, (match, p1) => {
    if (p1.includes(',')) {
      // "gluten,lait,soja" -> ["gluten", "lait", "soja"]
      const items = p1.split(',').map(s => `"${s.trim()}"`).join(', ');
      return `allergens: [${items}]`;
    }
    return `allergens: ["${p1}"]`;
  });
  
  content = content.replace(/allergens: '([^']+)'/g, (match, p1) => {
    if (p1.includes(',')) {
      const items = p1.split(',').map(s => `"${s.trim()}"`).join(', ');
      return `allergens: [${items}]`;
    }
    return `allergens: ["${p1}"]`;
  });
  
  // 7. Ajouter allergens: [] si category existe mais pas allergens
  content = content.replace(
    /(category: '[^']+',)\s*name:/g,
    '$1\n        allergens: [],\n        name:'
  );
  
  // 8. Ajouter champs nutritionnels manquants (calories, proteins, etc.)
  // Si c'est un baseIngredient.create sans calories, ajouter des valeurs par défaut
  content = content.replace(
    /(baseIngredient\.create\(\{\s*data:\s*\{[^}]+name: '[^']+',)(\s*)(allergens:[^,]+,)?(\s*)(\})/g,
    (match, before, space1, allergens, space2, after) => {
      // Si pas de calories dans le match, c'est qu'il manque des champs
      if (!match.includes('calories')) {
        return `${before}${space1}${allergens || 'allergens: [],'}${space2}calories: 0,${space2}proteins: 0,${space2}carbs: 0,${space2}sugars: 0,${space2}fats: 0,${space2}saturatedFats: 0,${space2}salt: 0${space2}${after}`;
      }
      return match;
    }
  );
  
  // Sauvegarder
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Migrated ${file}`);
});

console.log(`\n✅ Migration complete! ${testFiles.length} files processed.`);
console.log(`\n🧪 Run tests: docker-compose exec recipe-service npm test`);
