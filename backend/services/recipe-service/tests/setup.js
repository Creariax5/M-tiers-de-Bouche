// Configuration Jest - exécuté avant tous les tests
// UTILISE UN SCHEMA DE TEST SÉPARÉ pour ne pas polluer les données de prod

import { PrismaClient } from '@prisma/client';

process.env.NODE_ENV = 'test';
// Utiliser le schéma 'test' au lieu de 'public' pour isoler les tests
process.env.DATABASE_URL = process.env.DATABASE_URL?.replace('?schema=public', '?schema=test') 
  || 'postgresql://postgres:postgres@postgres:5432/saas_recipes?schema=test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// Créer le schéma test et appliquer les migrations
console.log('🌱 Setting up test database...');

const prisma = new PrismaClient();

try {
  // Créer le schéma test s'il n'existe pas
  await prisma.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS test');
  
  // Appliquer les migrations sur le schéma test
  const { execSync } = await import('child_process');
  execSync('npx prisma migrate deploy', {
    stdio: 'pipe',
    env: { ...process.env }
  });
  
  // Créer des base ingredients mock pour les tests qui en ont besoin
  const existingCount = await prisma.baseIngredient.count();
  if (existingCount === 0) {
    await prisma.baseIngredient.createMany({
      data: [
        { name: 'Farine de blé T55', category: 'FARINES', ciqualCode: 'TEST001', calories: 360, proteins: 11, carbs: 72, fats: 1.5, salt: 0.01, allergens: ['GLUTEN'] },
        { name: 'Farine de seigle', category: 'FARINES', ciqualCode: 'TEST002', calories: 340, proteins: 9, carbs: 68, fats: 1.2, salt: 0.01, allergens: ['GLUTEN'] },
        { name: 'Sucre blanc', category: 'SUCRES', ciqualCode: 'TEST003', calories: 400, proteins: 0, carbs: 100, fats: 0, salt: 0, allergens: [] },
        { name: 'Beurre doux', category: 'MATIERES_GRASSES', ciqualCode: 'TEST004', calories: 750, proteins: 0.5, carbs: 0.5, fats: 82, salt: 0.02, allergens: ['LAIT'] },
        { name: 'Lait entier', category: 'PRODUITS_LAITIERS', ciqualCode: 'TEST005', calories: 65, proteins: 3.2, carbs: 4.8, fats: 3.6, salt: 0.1, allergens: ['LAIT'] },
        { name: 'Oeuf entier', category: 'OEUFS', ciqualCode: 'TEST006', calories: 155, proteins: 12.6, carbs: 0.7, fats: 11, salt: 0.4, allergens: ['OEUFS'] },
        { name: 'Chocolat noir 70%', category: 'CHOCOLAT_CACAO', ciqualCode: 'TEST007', calories: 550, proteins: 7.5, carbs: 32, fats: 41, salt: 0.02, allergens: [] },
        { name: 'Levure boulangère', category: 'LEVURES', ciqualCode: 'TEST008', calories: 105, proteins: 8.4, carbs: 12.1, fats: 1.9, salt: 0.05, allergens: [] },
        { name: 'Vanille gousse', category: 'EPICES', ciqualCode: 'TEST009', calories: 288, proteins: 0.1, carbs: 12.7, fats: 0.1, salt: 0.01, allergens: [] },
        { name: 'Pomme Golden', category: 'FRUITS', ciqualCode: 'TEST010', calories: 54, proteins: 0.3, carbs: 12.1, fats: 0.2, salt: 0.01, allergens: [] },
      ],
      skipDuplicates: true
    });
    console.log('✅ Test base ingredients created');
  }
  
  console.log('✅ Test database ready\n');
} catch (error) {
  console.error('⚠️ Test schema setup warning:', error.message);
} finally {
  await prisma.$disconnect();
}
