/**
 * Import Ciqual 2020 - Script d'import base de données nutritionnelle française
 * 
 * Ce script importe 3000+ aliments de la base Ciqual dans BaseIngredient
 * 
 * Données importées :
 * - Nom français/anglais
 * - Code Ciqual
 * - Valeurs nutritionnelles (calories, protéines, glucides, lipides, sel, sucres, AG saturés, fibres)
 * - Catégorie (mapping Ciqual → IngredientCategory)
 * - Allergènes (inférés selon catégorie)
 */

import { PrismaClient } from '@prisma/client';
import { parseStringPromise } from 'xml2js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Mapping codes constituants Ciqual → champs BaseIngredient
const NUTRIENT_CODES = {
  328: 'calories',       // Energie, Règlement UE N° 1169/2011 (kcal/100 g)
  25000: 'proteins',     // Protéines, N x facteur de Jones (g/100 g)
  31000: 'carbs',        // Glucides (g/100 g)
  40000: 'fats',         // Lipides (g/100 g)
  10004: 'salt',         // Sel chlorure de sodium (g/100 g)
  32000: 'sugars',       // Sucres (g/100 g)
  40302: 'saturatedFats',// AG saturés (g/100 g)
  34100: 'fiber'         // Fibres alimentaires (g/100 g)
};

// Mapping catégories Ciqual → IngredientCategory enum (12 catégories)
const CATEGORY_MAPPING = {
  // FARINES (code 09 = céréales + 16 = pâtisseries/viennoiseries)
  '09': 'FARINES',
  '16': 'FARINES',
  
  // SUCRES (code 18 = sucres et dérivés)
  '18': 'SUCRES',
  
  // MATIERES_GRASSES (code 17 = huiles et graisses)
  '17': 'MATIERES_GRASSES',
  
  // PRODUITS_LAITIERS (code 12 = lait et produits laitiers)
  '12': 'PRODUITS_LAITIERS',
  
  // OEUFS (code 22 = œufs et dérivés)
  '22': 'OEUFS',
  
  // CHOCOLAT_CACAO (code 05 = chocolat)
  '05': 'CHOCOLAT_CACAO',
  
  // FRUITS (code 13 = fruits + 14 = légumes)
  '13': 'FRUITS',
  '14': 'FRUITS',
  
  // FRUITS_SECS (code 15 = fruits secs, noix)
  '15': 'FRUITS_SECS',
  
  // EPICES (code 11 = épices, aromates, condiments)
  '11': 'EPICES',
  
  // LEVURES (pas de code direct - sera géré manuellement)
  
  // ADDITIFS (pas de code direct - sera géré manuellement)
  
  // AUTRE (tout le reste)
  DEFAULT: 'AUTRE'
};

// Mapping allergènes par catégorie (14 allergènes INCO)
const ALLERGEN_BY_CATEGORY = {
  FARINES: ['GLUTEN'],
  PRODUITS_LAITIERS: ['LAIT'],
  OEUFS: ['OEUFS'],
  FRUITS_SECS: ['FRUITS_A_COQUE'],
  AUTRE: []
};

/**
 * Parse un fichier XML et retourne un objet JavaScript
 */
async function parseXML(filePath) {
  // Lire en latin1 (ISO-8859-1) car windows-1252 non supporté
  const xmlContent = await fs.readFile(filePath, 'latin1');
  
  return parseStringPromise(xmlContent, { 
    trim: true,
    explicitArray: false,
    mergeAttrs: true,
    strict: false,  // Parser non strict pour tolérer les erreurs XML
    normalize: true, // Normaliser les espaces
    normalizeTags: true // Normaliser les noms de balises
  });
}

/**
 * Charge la liste des aliments depuis alim_2020_07_07.xml
 * @returns {Map} Map<alim_code, {name, nameEn, groupCode}>
 */
async function loadAliments(dataDir) {
  console.log('📖 Chargement aliments...');
  const xmlPath = path.join(dataDir, 'alim_2020_07_07.xml');
  const data = await parseXML(xmlPath);
  
  const aliments = new Map();
  const alimentList = Array.isArray(data.table.alim) ? data.table.alim : [data.table.alim];
  
  for (const alim of alimentList) {
    // xml2js retourne des objets, accéder à la valeur directement
    const code = String(alim.alim_code || '').trim();
    if (!code) continue;
    
    aliments.set(code, {
      name: String(alim.alim_nom_fr || '').trim(),
      nameEn: String(alim.alim_nom_eng || '').trim(),
      groupCode: String(alim.alim_grp_code || '99').trim()
    });
  }
  
  console.log(`✅ ${aliments.size} aliments chargés`);
  return aliments;
}

/**
 * Charge les compositions nutritionnelles depuis compo_2020_07_07.xml
 * Ce fichier fait 57 Mo - on utilise un parser stream pour éviter de saturer la mémoire
 * @returns {Map} Map<alim_code, {calories, proteins, carbs, fats, salt, ...}>
 */
async function loadCompositions(dataDir) {
  console.log('📖 Chargement compositions nutritionnelles (fichier 57 Mo)...');
  const xmlPath = path.join(dataDir, 'compo_2020_07_07.xml');
  
  // On va parser ligne par ligne pour éviter de charger 57 Mo en RAM
  const xmlContent = await fs.readFile(xmlPath, 'latin1');
  const data = await parseStringPromise(xmlContent, { 
    trim: true,
    explicitArray: false,
    strict: false,
    normalize: true,
    normalizeTags: true
  });
  
  const compositions = new Map();
  const compoList = Array.isArray(data.table.compo) ? data.table.compo : [data.table.compo];
  
  let processedCount = 0;
  for (const compo of compoList) {
    const alimentCode = String(compo.alim_code || '').trim();
    const constituentCode = parseInt(String(compo.const_code || '0').trim());
    const value = parseFloat(String(compo.teneur || '0').trim());
    
    if (!alimentCode || !constituentCode || isNaN(value)) continue;
    
    // Vérifier si ce constituant nous intéresse
    const nutrientField = NUTRIENT_CODES[constituentCode];
    if (!nutrientField) continue;
    
    // Initialiser l'objet composition si nécessaire
    if (!compositions.has(alimentCode)) {
      compositions.set(alimentCode, {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        salt: 0,
        sugars: null,
        saturatedFats: null,
        fiber: null
      });
    }
    
    // Ajouter la valeur
    const compoData = compositions.get(alimentCode);
    compoData[nutrientField] = value;
    
    processedCount++;
    if (processedCount % 10000 === 0) {
      console.log(`  Traité ${processedCount} compositions...`);
    }
  }
  
  console.log(`✅ ${compositions.size} aliments avec données nutritionnelles`);
  return compositions;
}

/**
 * Détermine la catégorie IngredientCategory à partir du code groupe Ciqual
 */
function getCategoryFromGroupCode(groupCode) {
  return CATEGORY_MAPPING[groupCode] || CATEGORY_MAPPING.DEFAULT;
}

/**
 * Retourne les allergènes par défaut selon la catégorie
 */
function getAllergensForCategory(category) {
  return ALLERGEN_BY_CATEGORY[category] || [];
}

/**
 * Import principal - Crée les BaseIngredient depuis les données Ciqual
 */
async function importCiqual() {
  const dataDir = path.join(__dirname, 'data', 'ciqual-2020-fr');
  
  console.log('🚀 IMPORT CIQUAL 2020');
  console.log('====================\n');
  
  try {
    // 1. Charger aliments
    const aliments = await loadAliments(dataDir);
    
    // 2. Charger compositions nutritionnelles
    const compositions = await loadCompositions(dataDir);
    
    // 3. Import en base de données
    console.log('\n💾 Import en base de données PostgreSQL...');
    
    let importedCount = 0;
    let skippedCount = 0;
    const batchSize = 100;
    let batch = [];
    
    for (const [code, aliment] of aliments) {
      const compo = compositions.get(code);
      
      // Ignorer si pas de données nutritionnelles complètes
      if (!compo || compo.calories === 0) {
        skippedCount++;
        continue;
      }
      
      const category = getCategoryFromGroupCode(aliment.groupCode);
      const allergens = getAllergensForCategory(category);
      
      batch.push({
        category,
        name: aliment.name,
        ciqualCode: code,
        calories: compo.calories,
        proteins: compo.proteins,
        carbs: compo.carbs,
        fats: compo.fats,
        salt: compo.salt,
        sugars: compo.sugars,
        saturatedFats: compo.saturatedFats,
        fiber: compo.fiber,
        allergens
      });
      
      // Traiter par batch de 100
      if (batch.length >= batchSize) {
        await prisma.baseIngredient.createMany({
          data: batch,
          skipDuplicates: true
        });
        importedCount += batch.length;
        console.log(`  ✅ ${importedCount} aliments importés...`);
        batch = [];
      }
    }
    
    // Traiter le dernier batch
    if (batch.length > 0) {
      await prisma.baseIngredient.createMany({
        data: batch,
        skipDuplicates: true
      });
      importedCount += batch.length;
    }
    
    console.log('\n✅ IMPORT TERMINÉ');
    console.log(`   - ${importedCount} aliments importés`);
    console.log(`   - ${skippedCount} aliments ignorés (données incomplètes)`);
    
    // 4. Créer index full-text search
    console.log('\n🔍 Création index full-text search...');
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS base_ingredient_search_idx 
      ON base_ingredients 
      USING gin(to_tsvector('french', name))
    `;
    console.log('✅ Index créé');
    
    // 5. Statistiques
    console.log('\n📊 STATISTIQUES');
    const stats = await prisma.baseIngredient.groupBy({
      by: ['category'],
      _count: true
    });
    
    stats.forEach(stat => {
      console.log(`   - ${stat.category}: ${stat._count} aliments`);
    });
    
  } catch (error) {
    console.error('❌ ERREUR:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Lancer l'import
importCiqual().catch(console.error);
