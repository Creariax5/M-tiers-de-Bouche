import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

console.log(`🔄 Fixing ${testFiles.length} test files...\n`);

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  console.log(`📝 Processing ${file}...`);
  
  // 1. Remplacer ingredientId par baseIngredientId
  content = content.replace(/ingredientId:/g, 'baseIngredientId:');
  
  // 2. Convertir units en enum
  content = content.replace(/unit: 'g'/g, "unit: 'G'");
  content = content.replace(/unit: 'kg'/g, "unit: 'KG'");
  content = content.replace(/unit: 'ml'/g, "unit: 'ML'");
  content = content.replace(/unit: 'L'/g, "unit: 'L'");
  content = content.replace(/unit: 'pièce'/g, "unit: 'PIECE'");
  content = content.replace(/unit: 'piece'/g, "unit: 'PIECE'");
  
  // 3. Convertir allergens strings en arrays
  content = content.replace(/allergens: '([^']+)'/g, (match, p1) => {
    if (p1.includes(',')) {
      const items = p1.split(',').map(s => `'${s.trim()}'`).join(', ');
      return `allergens: [${items}]`;
    }
    return `allergens: ['${p1}']`;
  });
  
  content = content.replace(/allergens: "([^"]+)"/g, (match, p1) => {
    if (p1.includes(',')) {
      const items = p1.split(',').map(s => `'${s.trim()}'`).join(', ');
      return `allergens: [${items}]`;
    }
    return `allergens: ['${p1}']`;
  });
  
  content = content.replace(/allergens: null/g, 'allergens: []');
  
  // 4. Ajouter category et nutrition fields ligne par ligne
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    result.push(line);
    
    // Détecter baseIngredient.create({ data: {
    if (line.includes('prisma.baseIngredient.create') && line.includes('data:') && line.includes('{')) {
      // Ligne suivante : vérifier si c'est name: ou si category existe
      let j = i + 1;
      let hasCategory = false;
      let hasNutrition = false;
      let foundFirstField = false;
      
      // Scanner les 15 lignes suivantes
      while (j < Math.min(i + 15, lines.length) && !foundFirstField) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('category:')) {
          hasCategory = true;
          break;
        }
        if (nextLine.startsWith('calories:')) {
          hasNutrition = true;
        }
        if (nextLine.startsWith('name:') || nextLine.startsWith('price')) {
          foundFirstField = true;
          break;
        }
        j++;
      }
      
      // Si pas de category, l'ajouter
      if (!hasCategory) {
        const indent = '      '; // 6 espaces standard
        result.push(`${indent}category: 'AUTRE',`);
      }
      
      // Si pas de nutrition, l'ajouter
      if (!hasNutrition && !hasCategory) {
        const indent = '      ';
        result.push(`${indent}calories: 0,`);
        result.push(`${indent}proteins: 0,`);
        result.push(`${indent}carbs: 0,`);
        result.push(`${indent}fats: 0,`);
        result.push(`${indent}salt: 0,`);
      }
    }
    
    i++;
  }
  
  content = result.join('\n');
  
  // Sauvegarder seulement si modifié
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Fixed ${file}`);
  } else {
    console.log(`  ⏭️  No changes for ${file}`);
  }
});

console.log(`\n✅ Fix complete! ${testFiles.length} files processed.`);
console.log(`\n🧪 Run tests: npm test`);
