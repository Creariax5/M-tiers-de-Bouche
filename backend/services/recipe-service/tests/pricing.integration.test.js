import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Génération de tokens JWT pour l'authentification
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
};

describe('GET //:id/pricing', () => {
  let testRecipe;
  let testUser = { id: 'test-user-pricing', email: 'pricing@test.com' };
  let testUser2 = { id: 'test-user-other', email: 'other@test.com' };
  let token;
  let token2;

  beforeEach(async () => {
    // Générer tokens
    token = generateToken(testUser);
    token2 = generateToken(testUser2);

    // Créer recette de test
    testRecipe = await prisma.recipe.create({
      data: {
        userId: testUser.id,
        name: 'Croissant',
        servings: 10,
      },
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

  it('should calculate cost with ingredients', async () => {
    // Créer ingrédients avec prix
    const farine = await prisma.baseIngredient.create({
      data: {
        
        name: 'Farine T55',
        
        pricePerUnit: 0.002, // 2€/kg = 0.002€/g
      },
    });

    const beurre = await prisma.baseIngredient.create({
      data: {
        
        name: 'Beurre doux',
        
        pricePerUnit: 0.01, // 10€/kg = 0.01€/g
      },
    });

    // Ajouter ingrédients à la recette
    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: farine.id,
        quantity: 500,
        
        lossPercent: 0,
      },
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: beurre.id,
        quantity: 250,
        
        lossPercent: 0,
      },
    });

    // Appeler endpoint
    const response = await request(app)
      .get(`/${testRecipe.id}/pricing`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const pricing = response.body.pricing;

    // Coût total = (500g * 0.002€) + (250g * 0.01€) = 1€ + 2.5€ = 3.5€
    expect(pricing.totalCost).toBeCloseTo(3.5, 2);
    
    // Coût par portion = 3.5€ / 10 portions = 0.35€
    expect(pricing.costPerServing).toBeCloseTo(0.35, 2);
    
    // Prix suggéré avec coeff 3 par défaut = 3.5€ * 3 = 10.5€
    expect(pricing.suggestedPrice).toBeCloseTo(10.5, 2);
    
    // Marge = ((10.5 - 3.5) / 10.5) * 100 = 66.67%
    expect(pricing.marginPercent).toBeCloseTo(66.67, 1);
  });

  it('should calculate cost with loss percent', async () => {
    // Viande avec perte à la cuisson
    const viande = await prisma.baseIngredient.create({
      data: {
        
        name: 'Viande hachée',
        
        pricePerUnit: 0.015, // 15€/kg
      },
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: viande.id,
        quantity: 1000,
        
        lossPercent: 20, // 20% de perte
      },
    });

    const response = await request(app)
      .get(`/${testRecipe.id}/pricing`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const pricing = response.body.pricing;

    // Coût = 1000g * 0.015€ * (1 + 0.20) = 15€ * 1.2 = 18€
    expect(pricing.totalCost).toBeCloseTo(18, 2);
  });

  it('should use custom coefficient if provided', async () => {
    const sel = await prisma.baseIngredient.create({
      data: {
        
        name: 'Sel',
        
        pricePerUnit: 0.001, // 1€/kg
      },
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: sel.id,
        quantity: 10,
        
        lossPercent: 0,
      },
    });

    // Coeff personnalisé = 5
    const response = await request(app)
      .get(`/${testRecipe.id}/pricing?coefficient=5`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const pricing = response.body.pricing;

    // Coût = 10g * 0.001€ = 0.01€
    expect(pricing.totalCost).toBeCloseTo(0.01, 2);
    
    // Prix suggéré = 0.01€ * 5 = 0.05€
    expect(pricing.suggestedPrice).toBeCloseTo(0.05, 2);
    
    // Marge = ((0.05 - 0.01) / 0.05) * 100 = 80%
    expect(pricing.marginPercent).toBeCloseTo(80, 1);
  });

  it('should return zero cost when no ingredients', async () => {
    const response = await request(app)
      .get(`/${testRecipe.id}/pricing`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const pricing = response.body.pricing;

    expect(pricing.totalCost).toBe(0);
    expect(pricing.costPerServing).toBe(0);
    expect(pricing.suggestedPrice).toBe(0);
    expect(pricing.marginPercent).toBe(0);
  });

  it('should fail when recipe does not belong to user', async () => {
    await request(app)
      .get(`/${testRecipe.id}/pricing`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(404);
  });

  it('should fail without authentication', async () => {
    await request(app)
      .get(`/${testRecipe.id}/pricing`)
      .expect(401);
  });

  it('should include pricing in GET //:id', async () => {
    // Ajouter un ingrédient
    const sucre = await prisma.baseIngredient.create({
      data: {
        
        name: 'Sucre',
        
        pricePerUnit: 0.0015, // 1.5€/kg
      },
    });

    await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        baseIngredientId: sucre.id,
        quantity: 200,
        
        lossPercent: 0,
      },
    });

    const response = await request(app)
      .get(`/${testRecipe.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Vérifier que pricing est inclus
    expect(response.body).toHaveProperty('pricing');
    expect(response.body.pricing).toHaveProperty('totalCost');
    expect(response.body.pricing).toHaveProperty('costPerServing');
    expect(response.body.pricing).toHaveProperty('suggestedPrice');
    expect(response.body.pricing).toHaveProperty('marginPercent');
    
    // Coût = 200g * 0.0015€ = 0.3€
    expect(response.body.pricing.totalCost).toBeCloseTo(0.3, 2);
  });
});

