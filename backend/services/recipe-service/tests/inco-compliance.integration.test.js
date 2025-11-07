import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';
import { generateIngredientList, formatAllergenList } from '../src/services/allergen.service.js';

const testUser = {
  id: 'test-user-inco-123',
  email: 'inco@example.com'
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

let token;
let testRecipe;

beforeAll(async () => {
  token = generateToken(testUser);
});

beforeEach(async () => {
  testRecipe = await prisma.recipe.create({
    data: {
      userId: testUser.id,
      name: 'Pain complet',
      servings: 4
    }
  });
});

afterEach(async () => {
  await prisma.recipeIngredient.deleteMany({});
  await prisma.baseIngredient.deleteMany({});
  await prisma.recipe.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('INCO Compliance - Liste ingrédients (Article 18)', () => {
  it('should generate ingredient list in ponderal order', async () => {
    // Créer ingrédients avec poids différents
    const farine = await prisma.baseIngredient.create({
      data: {
        
        name: 'Farine de blé',
        
        allergens: 'gluten'
      }
    });

    const eau = await prisma.baseIngredient.create({
      data: {
        
        name: 'Eau',
        unit: 'ml'
      }
    });

    const sel = await prisma.baseIngredient.create({
      data: {
        
        name: 'Sel',
        unit: 'g'
      }
    });

    // Ajouter dans ordre aléatoire (pas pondéral)
    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: eau.id, quantity: 300, unit: 'ml' },
        { recipeId: testRecipe.id, ingredientId: sel.id, quantity: 10, unit: 'g' },
        { recipeId: testRecipe.id, ingredientId: farine.id, quantity: 500, unit: 'g' }
      ]
    });

    const list = await generateIngredientList(testRecipe.id, 'text');

    // Vérifier ordre pondéral décroissant: Farine (500g) > Eau (300ml) > Sel (10g)
    expect(list).toMatch(/^FARINE DE BLÉ.*Eau.*Sel/);
  });

  it('should highlight allergens in UPPERCASE (text format)', async () => {
    const lait = await prisma.baseIngredient.create({
      data: {
        
        name: 'Lait entier',
        
        allergens: 'lait'
      }
    });

    const sucre = await prisma.baseIngredient.create({
      data: {
        
        name: 'Sucre',
        unit: 'g'
        // Pas d'allergène
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: lait.id, quantity: 200, unit: 'ml' },
        { recipeId: testRecipe.id, ingredientId: sucre.id, quantity: 50, unit: 'g' }
      ]
    });

    const list = await generateIngredientList(testRecipe.id, 'text');

    // Allergènes en MAJUSCULES
    expect(list).toContain('LAIT ENTIER');
    // Non-allergènes en minuscules
    expect(list).toContain('Sucre');
  });

  it('should highlight allergens with <strong> (HTML format)', async () => {
    const oeufs = await prisma.baseIngredient.create({
      data: {
        
        name: 'Œufs',
        
        allergens: 'oeufs'
      }
    });

    const beurre = await prisma.baseIngredient.create({
      data: {
        
        name: 'Beurre',
        
        allergens: 'lait'
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: oeufs.id, quantity: 3, unit: 'pièce' },
        { recipeId: testRecipe.id, ingredientId: beurre.id, quantity: 100, unit: 'g' }
      ]
    });

    const list = await generateIngredientList(testRecipe.id, 'html');

    // Allergènes en <strong>
    expect(list).toContain('<strong>BEURRE</strong>'); // Plus lourd (100g)
    expect(list).toContain('<strong>ŒUFS</strong>');
  });

  it('should show percentage for major ingredients (>5%)', async () => {
    const farine = await prisma.baseIngredient.create({
      data: {
        
        name: 'Farine',
        
        allergens: 'gluten'
      }
    });

    const levure = await prisma.baseIngredient.create({
      data: {
        
        name: 'Levure',
        unit: 'g'
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: farine.id, quantity: 950, unit: 'g' }, // 95%
        { recipeId: testRecipe.id, ingredientId: levure.id, quantity: 50, unit: 'g' }   // 5%
      ]
    });

    const list = await generateIngredientList(testRecipe.id, 'text');

    // Farine >= 5% : afficher pourcentage
    expect(list).toMatch(/FARINE \(95%\)/);
    
    // Levure = 5% : afficher pourcentage
    expect(list).toMatch(/Levure \(5%\)/);
  });

  it('should NOT show percentage for minor ingredients (<5%)', async () => {
    const farine = await prisma.baseIngredient.create({
      data: {
        
        name: 'Farine',
        
        allergens: 'gluten'
      }
    });

    const sel = await prisma.baseIngredient.create({
      data: {
        
        name: 'Sel',
        unit: 'g'
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: farine.id, quantity: 980, unit: 'g' }, // 98%
        { recipeId: testRecipe.id, ingredientId: sel.id, quantity: 20, unit: 'g' }      // 2%
      ]
    });

    const list = await generateIngredientList(testRecipe.id, 'text');

    // Sel < 5% : pas de pourcentage
    expect(list).not.toMatch(/Sel \(/);
    expect(list).toContain('Sel');
  });
});

describe('INCO Compliance - Liste allergènes (Article 21)', () => {
  it('should format allergen list in French', async () => {
    const croissant = await prisma.baseIngredient.create({
      data: {
        
        name: 'Pâte à croissant',
        
        allergens: 'gluten,lait,oeufs'
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: croissant.id,
        quantity: 500,
        unit: 'g'
      }
    });

    const result = await formatAllergenList(testRecipe.id);

    expect(result.allergens).toEqual(['gluten', 'lait', 'oeufs']);
    expect(result.formatted).toBe('Céréales contenant du gluten, Lait, Œufs');
  });

  it('should deduplicate allergens from multiple ingredients', async () => {
    const farine = await prisma.baseIngredient.create({
      data: {
        
        name: 'Farine',
        
        allergens: 'gluten'
      }
    });

    const beurre = await prisma.baseIngredient.create({
      data: {
        
        name: 'Beurre',
        
        allergens: 'lait'
      }
    });

    const lait = await prisma.baseIngredient.create({
      data: {
        
        name: 'Lait',
        
        allergens: 'lait' // Même allergène que beurre
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: farine.id, quantity: 300, unit: 'g' },
        { recipeId: testRecipe.id, ingredientId: beurre.id, quantity: 50, unit: 'g' },
        { recipeId: testRecipe.id, ingredientId: lait.id, quantity: 100, unit: 'ml' }
      ]
    });

    const result = await formatAllergenList(testRecipe.id);

    // Pas de doublons "lait"
    expect(result.allergens).toEqual(['gluten', 'lait']);
    expect(result.formatted).toBe('Céréales contenant du gluten, Lait');
  });
});

describe('INCO Compliance - Nutrition (Articles 30-34)', () => {
  it('should include mandatory fields (kJ, kcal, sugars, saturatedFats)', async () => {
    const chocolat = await prisma.baseIngredient.create({
      data: {
        
        name: 'Chocolat noir',
        
        category: 'AUTRE',
        
        allergens: [],
        
        calories: 530,
        proteins: 7.5,
        carbs: 60,
        sugars: 50,        // 🆕 INCO obligatoire
        fats: 30,
        saturatedFats: 18, // 🆕 INCO obligatoire
        salt: 0.01
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: chocolat.id,
        quantity: 100,
        unit: 'g'
      }
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const nutrition = response.body.nutrition.per100g;

    // ✅ Énergie : kJ ET kcal (obligatoire)
    expect(nutrition).toHaveProperty('energyKj');
    expect(nutrition).toHaveProperty('energyKcal');
    expect(nutrition.energyKj).toBe(Math.round(530 * 4.184)); // 2217 kJ

    // ✅ dont sucres (obligatoire)
    expect(nutrition).toHaveProperty('sugars');
    expect(nutrition.sugars).toBe(50);

    // ✅ dont acides gras saturés (obligatoire)
    expect(nutrition).toHaveProperty('saturatedFats');
    expect(nutrition.saturatedFats).toBe(18);

    // ✅ Sel 2 décimales (Annexe XV)
    expect(nutrition.salt).toBe(0.01);
    expect(nutrition.salt.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });

  it('should round salt to 2 decimals (Annexe XV)', async () => {
    const jambon = await prisma.baseIngredient.create({
      data: {
        
        name: 'Jambon',
        
        category: 'AUTRE',
        
        allergens: [],
        
        calories: 120,
        proteins: 20,
        carbs: 1,
        sugars: 0.5,
        fats: 3,
        saturatedFats: 1.2,
        salt: 1.456 // Valeur avec 3 décimales
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: jambon.id,
        quantity: 100,
        unit: 'g'
      }
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token}`);

    const salt = response.body.nutrition.per100g.salt;

    // ✅ Arrondi à 2 décimales : 1.456 → 1.46
    expect(salt).toBe(1.46);
    
    // Vérifier format (max 2 décimales)
    const decimals = salt.toString().split('.')[1];
    expect(decimals?.length || 0).toBeLessThanOrEqual(2);
  });
});

