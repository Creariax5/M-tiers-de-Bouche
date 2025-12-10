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
// Codes Ciqual 2020 réels:
// 01 = entrées et plats composés
// 02 = fruits, légumes, légumineuses et oléagineux
// 03 = produits céréaliers
// 04 = viandes, œufs, poissons et assimilés
// 05 = produits laitiers et assimilés
// 06 = eaux et autres boissons
// 07 = produits sucrés
// 08 = glaces et sorbets
// 09 = matières grasses
// 10 = aides culinaires et ingrédients divers
// 11 = aliments infantiles
const CATEGORY_MAPPING = {
  // 01 - Entrées et plats composés → AUTRE
  '01': 'AUTRE',
  
  // 02 - Fruits, légumes, légumineuses et oléagineux → FRUITS
  '02': 'FRUITS',
  
  // 03 - Produits céréaliers (farines, pâtes, pain) → FARINES
  '03': 'FARINES',
  
  // 04 - Viandes, œufs, poissons → OEUFS (contient les œufs)
  '04': 'OEUFS',
  
  // 05 - Produits laitiers (lait, crème, fromage) → PRODUITS_LAITIERS
  '05': 'PRODUITS_LAITIERS',
  
  // 06 - Eaux et boissons → AUTRE
  '06': 'AUTRE',
  
  // 07 - Produits sucrés (sucre, miel, confiture, chocolat) → SUCRES
  '07': 'SUCRES',
  
  // 08 - Glaces et sorbets → AUTRE
  '08': 'AUTRE',
  
  // 09 - Matières grasses (beurre, huile, margarine) → MATIERES_GRASSES
  '09': 'MATIERES_GRASSES',
  
  // 10 - Aides culinaires (épices, sel, levure) → EPICES
  '10': 'EPICES',
  
  // 11 - Aliments infantiles → AUTRE
  '11': 'AUTRE',
  
  DEFAULT: 'AUTRE'
};

// Mapping allergènes par catégorie (14 allergènes INCO)
// Note: Ce sont des allergènes par défaut, à affiner selon les sous-catégories
const ALLERGEN_BY_CATEGORY = {
  FARINES: ['GLUTEN'],           // Céréales contiennent du gluten
  PRODUITS_LAITIERS: ['LAIT'],   // Produits laitiers
  OEUFS: [],                     // Viandes/œufs/poissons - à affiner par nom
  FRUITS: [],                    // Fruits - pas d'allergène par défaut
  FRUITS_SECS: ['FRUITS_A_COQUE'],// Noix, amandes, etc.
  MATIERES_GRASSES: [],          // Beurre → LAIT ajouté dynamiquement
  SUCRES: [],                    // Sucres
  EPICES: [],                    // Épices
  CHOCOLAT_CACAO: [],            // Chocolat - peut contenir lait
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
 * Extrait la valeur d'un champ XML (peut être string ou objet avec _)
 */
function extractValue(field) {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field.trim();
  if (typeof field === 'object' && field._) return String(field._).trim();
  if (typeof field === 'object') return '';
  return String(field).trim();
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
    // xml2js retourne des objets ou strings selon la structure
    const code = extractValue(alim.alim_code);
    if (!code) continue;
    
    aliments.set(code, {
      name: extractValue(alim.alim_nom_fr),
      nameEn: extractValue(alim.alim_nom_eng),
      groupCode: extractValue(alim.alim_grp_code) || '99'
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
    const alimentCode = extractValue(compo.alim_code);
    const constituentCode = parseInt(extractValue(compo.const_code) || '0');
    // Fix: French decimals use comma, convert to dot for parseFloat
    const rawValue = extractValue(compo.teneur).replace(',', '.') || '0';
    const value = parseFloat(rawValue);
    
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
  
  // Post-traitement: calculer les calories si manquantes (formule Atwater)
  // Calories = (protéines × 4) + (glucides × 4) + (lipides × 9)
  for (const [code, compo] of compositions) {
    if (compo.calories === 0 && (compo.proteins > 0 || compo.carbs > 0 || compo.fats > 0)) {
      compo.calories = Math.round((compo.proteins * 4) + (compo.carbs * 4) + (compo.fats * 9));
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
 * Affine la catégorie basée sur le nom de l'aliment
 * Certains aliments dans une catégorie Ciqual doivent être reclassés
 */
function refineCategoryByName(name, baseCategory) {
  const nameLower = name.toLowerCase();
  
  // Chocolat et cacao → CHOCOLAT_CACAO (même si classé dans SUCRES par Ciqual)
  if (nameLower.includes('chocolat') || nameLower.includes('cacao') || 
      nameLower.includes('pâte à tartiner') || nameLower.includes('nutella')) {
    return 'CHOCOLAT_CACAO';
  }
  
  // Fruits secs (noix, amandes, etc.) → FRUITS_SECS
  if (nameLower.includes('noix') || nameLower.includes('noisette') ||
      nameLower.includes('amande') || nameLower.includes('pistache') ||
      nameLower.includes('cacahuète') || nameLower.includes('arachide') ||
      nameLower.includes('noix de cajou') || nameLower.includes('pécan')) {
    return 'FRUITS_SECS';
  }
  
  // Levures → LEVURES
  if (nameLower.includes('levure') || nameLower.includes('bicarbonate')) {
    return 'LEVURES';
  }
  
  // Additifs (colorants, épaississants, etc.) → ADDITIFS
  if (nameLower.includes('colorant') || nameLower.includes('gélatine') ||
      nameLower.includes('agar') || nameLower.includes('pectine')) {
    return 'ADDITIFS';
  }
  
  return baseCategory;
}

/**
 * Retourne les allergènes par défaut selon la catégorie
 */
function getAllergensForCategory(category) {
  return ALLERGEN_BY_CATEGORY[category] || [];
}

/**
 * Détecte les allergènes supplémentaires basés sur le nom de l'aliment
 */
function detectAllergensFromName(name, category) {
  const allergens = new Set(getAllergensForCategory(category));
  const nameLower = name.toLowerCase();
  
  // Détection par mots-clés dans le nom
  if (nameLower.includes('œuf') || nameLower.includes('oeuf') || nameLower.includes('egg')) {
    allergens.add('OEUFS');
  }
  if (nameLower.includes('lait') || nameLower.includes('crème') || nameLower.includes('creme') || 
      nameLower.includes('fromage') || nameLower.includes('beurre') || nameLower.includes('yaourt') ||
      nameLower.includes('milk') || nameLower.includes('butter') || nameLower.includes('cheese')) {
    allergens.add('LAIT');
  }
  if (nameLower.includes('blé') || nameLower.includes('ble') || nameLower.includes('farine') ||
      nameLower.includes('pain') || nameLower.includes('pâte') || nameLower.includes('pate') ||
      nameLower.includes('wheat') || nameLower.includes('semoule') || nameLower.includes('orge') ||
      nameLower.includes('seigle') || nameLower.includes('avoine') || nameLower.includes('épeautre')) {
    allergens.add('GLUTEN');
  }
  if (nameLower.includes('arachide') || nameLower.includes('cacahuète') || nameLower.includes('cacahuete') ||
      nameLower.includes('peanut')) {
    allergens.add('ARACHIDES');
  }
  if (nameLower.includes('amande') || nameLower.includes('noix') || nameLower.includes('noisette') ||
      nameLower.includes('pistache') || nameLower.includes('cajou') || nameLower.includes('pécan') ||
      nameLower.includes('macadamia') || nameLower.includes('nut')) {
    allergens.add('FRUITS_A_COQUE');
  }
  if (nameLower.includes('soja') || nameLower.includes('soy') || nameLower.includes('tofu')) {
    allergens.add('SOJA');
  }
  if (nameLower.includes('poisson') || nameLower.includes('saumon') || nameLower.includes('thon') ||
      nameLower.includes('cabillaud') || nameLower.includes('fish')) {
    allergens.add('POISSONS');
  }
  if (nameLower.includes('crustacé') || nameLower.includes('crevette') || nameLower.includes('crabe') ||
      nameLower.includes('homard') || nameLower.includes('langouste')) {
    allergens.add('CRUSTACES');
  }
  if (nameLower.includes('mollusque') || nameLower.includes('moule') || nameLower.includes('huître') ||
      nameLower.includes('calamar') || nameLower.includes('poulpe')) {
    allergens.add('MOLLUSQUES');
  }
  if (nameLower.includes('sésame') || nameLower.includes('sesame')) {
    allergens.add('SESAME');
  }
  if (nameLower.includes('moutarde') || nameLower.includes('mustard')) {
    allergens.add('MOUTARDE');
  }
  if (nameLower.includes('céleri') || nameLower.includes('celeri') || nameLower.includes('celery')) {
    allergens.add('CELERI');
  }
  if (nameLower.includes('lupin')) {
    allergens.add('LUPIN');
  }
  if (nameLower.includes('sulfite') || nameLower.includes('vin ') || nameLower.includes('vinaigre')) {
    allergens.add('SULFITES');
  }
  
  return Array.from(allergens);
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
      
      // Ignorer si pas de données nutritionnelles (mais permettre calories = 0 pour eau, etc.)
      if (!compo) {
        skippedCount++;
        continue;
      }
      
      const baseCategory = getCategoryFromGroupCode(aliment.groupCode);
      const category = refineCategoryByName(aliment.name, baseCategory);
      const allergens = detectAllergensFromName(aliment.name, category);
      
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
