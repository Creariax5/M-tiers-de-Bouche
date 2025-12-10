/**
 * Script d'audit des allergènes dans la base Ciqual
 * Vérifie que les 14 allergènes obligatoires INCO sont bien détectés
 * 
 * Usage: node prisma/audit-allergens.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Les 14 allergènes obligatoires (ADO) selon règlement INCO
const ADO_14 = [
  'GLUTEN',        // Céréales contenant du gluten
  'CRUSTACES',     // Crustacés
  'OEUFS',         // Œufs
  'POISSONS',      // Poissons
  'ARACHIDES',     // Arachides
  'SOJA',          // Soja
  'LAIT',          // Lait
  'FRUITS_A_COQUE',// Fruits à coque
  'CELERI',        // Céleri
  'MOUTARDE',      // Moutarde
  'SESAME',        // Sésame
  'SULFITES',      // Sulfites (>10mg/kg)
  'LUPIN',         // Lupin
  'MOLLUSQUES'     // Mollusques
];

async function auditAllergens() {
  console.log('🔍 AUDIT ALLERGÈNES - BASE CIQUAL');
  console.log('='.repeat(50));
  
  // 1. Récupérer tous les ingrédients
  const ingredients = await prisma.baseIngredient.findMany({
    select: { 
      id: true,
      name: true, 
      allergens: true,
      category: true 
    }
  });
  
  console.log(`\n📊 Total ingrédients: ${ingredients.length}\n`);
  
  // 2. Compter par allergène
  const allergenCount = {};
  const allergenExamples = {};
  
  ingredients.forEach(ing => {
    if (ing.allergens && ing.allergens.length > 0) {
      ing.allergens.forEach(allergen => {
        allergenCount[allergen] = (allergenCount[allergen] || 0) + 1;
        if (!allergenExamples[allergen]) {
          allergenExamples[allergen] = [];
        }
        if (allergenExamples[allergen].length < 3) {
          allergenExamples[allergen].push(ing.name.substring(0, 40));
        }
      });
    }
  });
  
  // 3. Afficher les allergènes détectés
  console.log('📋 ALLERGÈNES DÉTECTÉS:');
  console.log('-'.repeat(50));
  
  Object.keys(allergenCount).sort().forEach(allergen => {
    const count = allergenCount[allergen];
    const examples = allergenExamples[allergen].join(', ');
    console.log(`  ${allergen}: ${count} ingrédients`);
    console.log(`    └─ Ex: ${examples}`);
  });
  
  // 4. Vérifier couverture des 14 ADO
  console.log('\n' + '='.repeat(50));
  console.log('⚖️ COUVERTURE 14 ADO (RÈGLEMENT INCO):');
  console.log('-'.repeat(50));
  
  let missingCount = 0;
  ADO_14.forEach(ado => {
    const count = allergenCount[ado] || 0;
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${ado}: ${count} ingrédients`);
    if (count === 0) missingCount++;
  });
  
  // 5. Résumé
  console.log('\n' + '='.repeat(50));
  if (missingCount === 0) {
    console.log('✅ TOUS LES 14 ADO SONT COUVERTS');
  } else {
    console.log(`⚠️ ${missingCount} ADO MANQUANT(S) - NON CONFORME INCO`);
  }
  
  // 6. Vérifier des cas spécifiques
  console.log('\n' + '='.repeat(50));
  console.log('🔬 VÉRIFICATION CAS SPÉCIFIQUES:');
  console.log('-'.repeat(50));
  
  const testCases = [
    { search: 'beurre', expected: 'LAIT' },
    { search: 'oeuf', expected: 'OEUFS' },
    { search: 'farine de blé', expected: 'GLUTEN' },
    { search: 'amande', expected: 'FRUITS_A_COQUE' },
    { search: 'crevette', expected: 'CRUSTACES' },
    { search: 'saumon', expected: 'POISSONS' },
    { search: 'soja', expected: 'SOJA' },
    { search: 'arachide', expected: 'ARACHIDES' },
    { search: 'moutarde', expected: 'MOUTARDE' },
    { search: 'sésame', expected: 'SESAME' },
    { search: 'céleri', expected: 'CELERI' },
  ];
  
  for (const test of testCases) {
    const found = ingredients.filter(i => 
      i.name.toLowerCase().includes(test.search)
    );
    
    if (found.length > 0) {
      const hasAllergen = found.some(i => 
        i.allergens && i.allergens.includes(test.expected)
      );
      const status = hasAllergen ? '✅' : '❌';
      console.log(`  ${status} "${test.search}" → ${test.expected}: ${hasAllergen ? 'OK' : 'MANQUE!'}`);
      
      if (!hasAllergen && found.length > 0) {
        console.log(`     └─ Trouvés: ${found.slice(0, 2).map(f => f.name).join(', ')}`);
        console.log(`     └─ Allergènes: ${found[0].allergens}`);
      }
    } else {
      console.log(`  ⚠️ "${test.search}": Aucun ingrédient trouvé`);
    }
  }
  
  await prisma.$disconnect();
}

auditAllergens().catch(console.error);
