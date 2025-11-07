/**
 * Prisma Seed - Données de test pour les tests d'intégration
 * Exécuté automatiquement avant les tests avec : prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Échantillon représentatif de la base Ciqual pour les tests
const SEED_INGREDIENTS = [
  // FARINES (73 dans la vraie base, on en met 60 pour le test)
  ...Array.from({ length: 60 }, (_, i) => ({
    name: `Farine de blé type ${45 + i}`,
    category: 'FARINES',
    calories: 350 + Math.random() * 15,
    proteins: 10 + Math.random() * 2,
    carbs: 70 + Math.random() * 5,
    fats: 1 + Math.random() * 0.5,
    salt: 0.01 + Math.random() * 0.01,
    sugars: 1 + Math.random() * 0.5,
    saturatedFats: 0.2 + Math.random() * 0.1,
    fiber: 3 + Math.random() * 1,
    allergens: ['GLUTEN'],
    ciqualCode: `SEED_FARINE_${i.toString().padStart(3, '0')}`,
  })),

  // CHOCOLAT_CACAO (237 dans la vraie base, on en met 120 pour le test)
  ...Array.from({ length: 120 }, (_, i) => ({
    name: `Chocolat ${i < 40 ? 'noir' : i < 80 ? 'au lait' : 'blanc'} ${Math.floor(Math.random() * 100)}%`,
    category: 'CHOCOLAT_CACAO',
    calories: 500 + Math.random() * 50,
    proteins: 5 + Math.random() * 3,
    carbs: 50 + Math.random() * 10,
    fats: 30 + Math.random() * 5,
    salt: 0.05 + Math.random() * 0.05,
    sugars: 40 + Math.random() * 10,
    saturatedFats: 15 + Math.random() * 5,
    fiber: 5 + Math.random() * 3,
    allergens: i < 40 ? [] : ['LAIT'],
    ciqualCode: `SEED_CHOCO_${i.toString().padStart(3, '0')}`,
  })),

  // EPICES (33 dans la vraie base)
  { name: 'Cannelle moulue', category: 'EPICES', calories: 247, proteins: 4, carbs: 81, fats: 1.2, salt: 0.01, sugars: 2, saturatedFats: 0.3, fiber: 53, allergens: [], ciqualCode: 'SEED_EPICE_001' },
  { name: 'Vanille en poudre', category: 'EPICES', calories: 288, proteins: 0.1, carbs: 12.7, fats: 0.1, salt: 0.01, sugars: 12.7, saturatedFats: 0, fiber: 0, allergens: [], ciqualCode: 'SEED_EPICE_002' },
  { name: 'Gingembre moulu', category: 'EPICES', calories: 335, proteins: 9, carbs: 72, fats: 4.2, salt: 0.03, sugars: 3.4, saturatedFats: 1.2, fiber: 14, allergens: [], ciqualCode: 'SEED_EPICE_003' },
  { name: 'Muscade moulue', category: 'EPICES', calories: 525, proteins: 5.8, carbs: 49, fats: 36, salt: 0.02, sugars: 28, saturatedFats: 25, fiber: 21, allergens: [], ciqualCode: 'SEED_EPICE_004' },
  { name: 'Cardamome moulue', category: 'EPICES', calories: 311, proteins: 11, carbs: 68, fats: 6.7, salt: 0.02, sugars: 0, saturatedFats: 0.7, fiber: 28, allergens: [], ciqualCode: 'SEED_EPICE_005' },
  ...Array.from({ length: 28 }, (_, i) => ({
    name: `Épice mélange ${i + 1}`,
    category: 'EPICES',
    calories: 300 + Math.random() * 100,
    proteins: 5 + Math.random() * 5,
    carbs: 50 + Math.random() * 20,
    fats: 5 + Math.random() * 10,
    salt: 0.01 + Math.random() * 0.05,
    sugars: 5 + Math.random() * 10,
    saturatedFats: 1 + Math.random() * 5,
    fiber: 10 + Math.random() * 20,
    allergens: [],
    ciqualCode: `SEED_EPICE_${(i + 6).toString().padStart(3, '0')}`,
  })),

  // AUTRE - Mix d'ingrédients divers (1854 dans la vraie base, on en met un échantillon représentatif)
  { name: 'Café moulu', category: 'AUTRE', calories: 1, proteins: 0.1, carbs: 0, fats: 0, salt: 0.01, sugars: 0, saturatedFats: 0, fiber: 0, allergens: [], ciqualCode: 'SEED_AUTRE_001' },
  { name: 'Levure chimique', category: 'AUTRE', calories: 100, proteins: 0, carbs: 28, fats: 0, salt: 11, sugars: 0, saturatedFats: 0, fiber: 0, allergens: [], ciqualCode: 'SEED_AUTRE_002' },
  { name: 'Levure boulangère fraîche', category: 'AUTRE', calories: 53, proteins: 11, carbs: 2, fats: 0.4, salt: 0.05, sugars: 2, saturatedFats: 0.1, fiber: 6, allergens: [], ciqualCode: 'SEED_AUTRE_003' },
  { name: 'Bicarbonate de soude alimentaire', category: 'AUTRE', calories: 0, proteins: 0, carbs: 0, fats: 0, salt: 27, sugars: 0, saturatedFats: 0, fiber: 0, allergens: [], ciqualCode: 'SEED_AUTRE_004' },
  { name: 'Gélatine en poudre', category: 'AUTRE', calories: 338, proteins: 85, carbs: 0, fats: 0.1, salt: 0.5, sugars: 0, saturatedFats: 0, fiber: 0, allergens: [], ciqualCode: 'SEED_AUTRE_005' },
  ...Array.from({ length: 1845 }, (_, i) => ({
    name: `Ingrédient ${i + 6}`,
    category: 'AUTRE',
    calories: 100 + Math.random() * 400,
    proteins: Math.random() * 20,
    carbs: Math.random() * 80,
    fats: Math.random() * 40,
    salt: Math.random() * 2,
    sugars: Math.random() * 50,
    saturatedFats: Math.random() * 20,
    fiber: Math.random() * 30,
    allergens: [],
    ciqualCode: `SEED_AUTRE_${(i + 6).toString().padStart(4, '0')}`,
  })),
];

async function main() {
  console.log('🌱 Seeding database...');
  
  // Nettoyer les données existantes
  await prisma.baseIngredient.deleteMany();
  console.log('✅ Cleaned existing data');

  // Insérer par lots de 100
  const batchSize = 100;
  for (let i = 0; i < SEED_INGREDIENTS.length; i += batchSize) {
    const batch = SEED_INGREDIENTS.slice(i, i + batchSize);
    await prisma.baseIngredient.createMany({
      data: batch,
    });
    console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(SEED_INGREDIENTS.length / batchSize)}`);
  }

  // Créer l'index full-text si besoin
  try {
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS base_ingredient_search_idx 
      ON base_ingredients 
      USING GIN (to_tsvector('french', name));
    `;
    console.log('✅ Full-text search index created');
  } catch (error) {
    console.log('ℹ️  Index already exists or error:', error.message);
  }

  const count = await prisma.baseIngredient.count();
  console.log(`\n✅ Seed completed: ${count} ingredients inserted`);

  // Statistiques par catégorie
  const stats = await prisma.baseIngredient.groupBy({
    by: ['category'],
    _count: true,
  });

  console.log('\n📊 Categories:');
  stats.forEach(stat => {
    console.log(`   - ${stat.category}: ${stat._count} items`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
