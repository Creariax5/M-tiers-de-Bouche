// Configuration Jest - exécuté avant tous les tests
import { execSync } from 'child_process';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/saas_recipes?schema=public';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// Exécuter le seed avant les tests
console.log('🌱 Running database seed...');
try {
  execSync('node prisma/seed.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Database seeded successfully\n');
} catch (error) {
  console.error('❌ Failed to seed database:', error.message);
  process.exit(1);
}
