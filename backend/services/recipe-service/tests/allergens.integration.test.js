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
      name: 'Tarte aux Pommes',
      servings: 8
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

describe('GET //:id/allergens', () => {
  it('should detect allergens from ingredients', async () => {
    // Créer des ingrédients avec allergènes
    const farine = await prisma.baseIngredient.create({
      data: {
        category: 'FARINES',
        name: 'Farine de blé T55',
        calories: 350,
        proteins: 10,
        carbs: 72,
        fats: 1.5,
        salt: 0.01,
        allergens: ['gluten']
      }
    });

    const beurre = await prisma.baseIngredient.create({
      data: {
        category: 'MATIERES_GRASSES',
        name: 'Beurre doux',
        calories: 750,
        proteins: 0.6,
        carbs: 0.1,
        fats: 82,
        salt: 0.8,
        allergens: ['lait']
      }
    });

    const oeufs = await prisma.baseIngredient.create({
      data: {
        category: 'OEUFS',
        name: 'Oeufs',
        calories: 145,
        proteins: 13,
        carbs: 1,
        fats: 10,
        salt: 0.3,
        allergens: ['oeufs']
      }
    });

    // Ajouter les ingrédients à la recette
    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, baseIngredientId: farine.id, quantity: 250, unit: 'G' },
        { recipeId: testRecipe.id, baseIngredientId: beurre.id, quantity: 150, unit: 'G' },
        { recipeId: testRecipe.id, baseIngredientId: oeufs.id, quantity: 3, unit: 'PIECE' }
      ]
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/allergens`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('allergens');
    expect(response.body.allergens).toBeInstanceOf(Array);
    expect(response.body.allergens).toHaveLength(3);
    expect(response.body.allergens).toContain('gluten');
    expect(response.body.allergens).toContain('lait');
    expect(response.body.allergens).toContain('oeufs');
  });

  it('should detect multiple allergens from single ingredient', async () => {
    // Ingrédient avec plusieurs allergènes
    const pain = await prisma.baseIngredient.create({
      data: {
        category: 'FARINES',
        name: 'Pain de mie',
        calories: 270,
        proteins: 9,
        carbs: 49,
        fats: 3.5,
        salt: 1.2,
        allergens: ['gluten', 'lait', 'soja']
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: pain.id,
        quantity: 100,
        unit: 'G'
      }
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/allergens`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.allergens).toHaveLength(3);
    expect(response.body.allergens).toContain('gluten');
    expect(response.body.allergens).toContain('lait');
    expect(response.body.allergens).toContain('soja');
  });

  it('should return empty array when no allergens', async () => {
    // Ingrédient sans allergène
    const sucre = await prisma.baseIngredient.create({
      data: {
        category: 'SUCRES',
        name: 'Sucre',
        calories: 400,
        proteins: 0,
        carbs: 100,
        fats: 0,
        salt: 0,
        allergens: []
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: sucre.id,
        quantity: 200,
        unit: 'G'
      }
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/allergens`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.allergens).toEqual([]);
  });

  it('should return unique allergens (no duplicates)', async () => {
    // Plusieurs ingrédients avec le même allergène
    const farine = await prisma.baseIngredient.create({
      data: {
        category: 'FARINES',
        name: 'Farine T55',
        calories: 350,
        proteins: 10,
        carbs: 72,
        fats: 1.5,
        salt: 0.01,
        allergens: ['gluten']
      }
    });

    const pain = await prisma.baseIngredient.create({
      data: {
        category: 'AUTRE',
        name: 'Chapelure',
        calories: 350,
        proteins: 12,
        carbs: 70,
        fats: 2,
        salt: 1.5,
        allergens: ['gluten']
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        { recipeId: testRecipe.id, baseIngredientId: farine.id, quantity: 250, unit: 'G' },
        { recipeId: testRecipe.id, baseIngredientId: pain.id, quantity: 50, unit: 'G' }
      ]
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/allergens`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.allergens).toEqual(['gluten']);
  });

  it('should fail when recipe does not belong to user', async () => {
    const token2 = generateToken({ id: 'other-user', email: 'other@example.com' });

    const response = await request(app)
      .get(`/${testRecipe.id}/allergens`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(404);
  });

  it('should fail when recipe does not exist', async () => {
    const response = await request(app)
      .get('//non-existent-id/allergens')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/${testRecipe.id}/allergens`);

    expect(response.status).toBe(401);
  });
});

describe('GET //:id (with allergens)', () => {
  it('should include allergens in recipe detail', async () => {
    // Créer ingrédient avec allergènes
    const noisettes = await prisma.baseIngredient.create({
      data: {
        category: 'FRUITS_SECS',
        name: 'Noisettes',
        calories: 628,
        proteins: 15,
        carbs: 17,
        fats: 61,
        salt: 0,
        allergens: ['fruits-a-coque']
      }
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: noisettes.id,
        quantity: 100,
        unit: 'G'
      }
    });

    const response = await request(app)
      .get(`/${testRecipe.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('allergens');
    expect(response.body.allergens).toContain('fruits-a-coque');
  });
});

