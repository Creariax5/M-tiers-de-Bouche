import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const testUser = {
  id: 'test-user-id-123',
  email: 'chef@example.com'
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
  // Créer une recette de test
  testRecipe = await prisma.recipe.create({
    data: {
      userId: testUser.id,
      name: 'Pain aux Céréales',
      servings: 10
    }
  });
});

afterEach(async () => {
  await prisma.recipeIngredient.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.recipe.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /recipes/:id/nutrition', () => {
  it('should calculate nutrition values for 100g', async () => {
    // Créer ingrédients avec valeurs nutritionnelles
    const farine = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Farine T65',
        unit: 'g',
        calories: 350, // pour 100g
        proteins: 10.5,
        carbs: 72.0,
        fats: 1.2,
        salt: 0.01
      }
    });

    const eau = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Eau',
        unit: 'ml',
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        salt: 0
      }
    });

    const sel = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Sel',
        unit: 'g',
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        salt: 100.0 // sel = 100% sodium
      }
    });

    // Ajouter ingrédients à la recette
    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, ingredientId: farine.id, quantity: 500, unit: 'g' },
        { recipeId: testRecipe.id, ingredientId: eau.id, quantity: 300, unit: 'ml' },
        { recipeId: testRecipe.id, ingredientId: sel.id, quantity: 10, unit: 'g' }
      ]
    });

    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nutrition');
    
    const nutrition = response.body.nutrition;
    
    // Vérifier la structure
    expect(nutrition).toHaveProperty('per100g');
    expect(nutrition).toHaveProperty('perServing');
    expect(nutrition).toHaveProperty('totalWeight');
    
    // Calculs attendus pour 100g:
    // Total: 500g farine + 300ml eau + 10g sel = 810g
    // Calories: (500 * 350 + 300 * 0 + 10 * 0) / 810 = 175000 / 810 ≈ 216 kcal/100g
    expect(nutrition.per100g.calories).toBeCloseTo(216, 0);
    expect(nutrition.per100g.proteins).toBeCloseTo(6.5, 1);
    expect(nutrition.per100g.carbs).toBeCloseTo(44.4, 1);
    expect(nutrition.per100g.fats).toBeCloseTo(0.7, 1);
    expect(nutrition.per100g.salt).toBeCloseTo(1.2, 1);
    
    // Vérifier poids total
    expect(nutrition.totalWeight).toBe(810);
  });

  it('should calculate nutrition per serving', async () => {
    // Ingrédient simple
    const beurre = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Beurre',
        unit: 'g',
        calories: 750,
        proteins: 0.6,
        carbs: 0.1,
        fats: 82.0,
        salt: 0.8
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: beurre.id,
        quantity: 250,
        unit: 'g'
      }
    });

    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    
    const nutrition = response.body.nutrition;
    
    // 10 portions de 250g total = 25g/portion
    expect(nutrition.perServing.weight).toBe(25);
    
    // Calories par portion = 750 * 0.25 = 187.5 kcal
    expect(nutrition.perServing.calories).toBeCloseTo(187.5, 1);
  });

  it('should handle lossPercent in calculations', async () => {
    // Viande avec perte à la cuisson
    const viande = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Viande hachée',
        unit: 'g',
        calories: 250,
        proteins: 20.0,
        carbs: 0.0,
        fats: 18.0,
        salt: 0.1
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: viande.id,
        quantity: 1000,
        unit: 'g',
        lossPercent: 20.0 // 20% de perte à la cuisson
      }
    });

    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    
    const nutrition = response.body.nutrition;
    
    // Poids final = 1000g * (1 - 0.20) = 800g
    expect(nutrition.totalWeight).toBe(800);
    
    // Calories restent basées sur poids initial (nutriments concentrés)
    // 1000g * 250kcal/100g = 2500 kcal total
    // Pour 100g final: 2500 / 800 * 100 = 312.5 kcal/100g
    expect(nutrition.per100g.calories).toBeCloseTo(312.5, 1);
  });

  it('should return zero values when no ingredients', async () => {
    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    
    const nutrition = response.body.nutrition;
    
    expect(nutrition.per100g.calories).toBe(0);
    expect(nutrition.per100g.proteins).toBe(0);
    expect(nutrition.per100g.carbs).toBe(0);
    expect(nutrition.per100g.fats).toBe(0);
    expect(nutrition.per100g.salt).toBe(0);
    expect(nutrition.totalWeight).toBe(0);
  });

  it('should fail when recipe does not belong to user', async () => {
    const token2 = generateToken({ id: 'other-user', email: 'other@example.com' });

    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/nutrition`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(404);
  });

  it('should fail when recipe does not exist', async () => {
    const response = await request(app)
      .get('/recipes/non-existent-id/nutrition')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/recipes/${testRecipe.id}/nutrition`);

    expect(response.status).toBe(401);
  });
});

describe('GET /recipes/:id (with nutrition)', () => {
  it('should include nutrition in recipe detail', async () => {
    // Créer ingrédient
    const sucre = await prisma.ingredient.create({
      data: {
        userId: 'system',
        name: 'Sucre',
        unit: 'g',
        calories: 400,
        proteins: 0,
        carbs: 100,
        fats: 0,
        salt: 0
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: sucre.id,
        quantity: 200,
        unit: 'g'
      }
    });

    const response = await request(app)
      .get(`/recipes/${testRecipe.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nutrition');
    expect(response.body.nutrition).toHaveProperty('per100g');
    expect(response.body.nutrition).toHaveProperty('perServing');
  });
});
