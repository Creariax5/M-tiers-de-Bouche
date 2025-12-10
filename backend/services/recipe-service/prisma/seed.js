/**
 * Prisma Seed - Importe les vraies données Ciqual
 * 
 * Ce script est exécuté par `prisma db seed` et utilise les vraies données
 * nutritionnelles de la base Ciqual ANSES (3000+ aliments).
 * 
 * Pour les tests: utilise les vraies données (pas de mock)
 * 
 * Usage:
 *   npx prisma db seed
 *   node prisma/seed.js
 */

import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Running database seed...');
  
  // Vérifier si la base contient déjà des données Ciqual réelles
  const ciqualCount = await prisma.baseIngredient.count({
    where: {
      NOT: { ciqualCode: { startsWith: 'SEED_' } }
    }
  });
  
  if (ciqualCount > 1000) {
    console.log(`✅ Base Ciqual déjà importée (${ciqualCount} aliments), skip...`);
    return;
  }
  
  // Supprimer TOUTES les données (y compris SEED_) pour repartir propre
  const deletedCount = await prisma.baseIngredient.deleteMany();
  console.log(`🗑️ Nettoyé ${deletedCount.count} anciennes données`);
  
  // Exécuter l'import Ciqual réel
  console.log('📥 Import base Ciqual (3000+ aliments)...');
  
  const importScript = path.join(__dirname, 'import-ciqual.js');
  
  await new Promise((resolve, reject) => {
    const child = spawn('node', [importScript], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Import failed with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
  
  // Vérification finale
  const finalCount = await prisma.baseIngredient.count();
  console.log(`\n✅ Database seeded: ${finalCount} ingrédients`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
