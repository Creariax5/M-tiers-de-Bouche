import fs from 'fs';
import path from 'path';

const testDir = path.join(process.cwd(), 'tests');
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

console.log(`🔄 Cleaning ${testFiles.length} test files...\n`);

let totalFixed = 0;

testFiles.forEach(filename => {
  const filePath = path.join(testDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  // Supprimer pricePerUnit dans baseIngredient.create (ligne entière)
  const before = content;
  content = content.replace(/(\s+)pricePerUnit:\s*[^,\n]+,?\n/g, '');
  
  if (content !== before) {
    fileFixed++;
    totalFixed++;
    console.log(`  ✅ Removed pricePerUnit from ${filename}`);
  }

  // Ajouter champs manquants obligatoires si absent
  // Pattern: baseIngredient.create({ data: { ... name: 'XXX', ... (check si calories présent)
  const hasIncompleteCreate = /baseIngredient\.create\(\{[^}]*data:\s*\{[^}]*name:[^}]*\}[^}]*\}/.test(content);
  
  if (hasIncompleteCreate && !/baseIngredient\.create\(\{[^}]*calories:/.test(content)) {
    console.log(`  ⚠️  ${filename} may have incomplete baseIngredient.create (missing required fields)`);
  }

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename}: ${fileFixed} fixes\n`);
  }
});

console.log(`\n✅ Total: ${totalFixed} fixes!`);
