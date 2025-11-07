import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const testUser = {
  id: 'test-user-stats-123',
  email: 'stats@example.com'
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
};

let token;

beforeAll(async () => {
  token = generateToken(testUser);
});

afterEach(async () => {
  await prisma.recipeIngredient.deleteMany({});
  await prisma.baseIngredient.deleteMany({});
  await prisma.recipe.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /recipes/stats', () => {
  it('should return stats with zero recipes', async () => {
    const res = await request(app)
      .get('/stats')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalRecipes', 0);
    expect(res.body).toHaveProperty('topProfitable');
    expect(res.body.topProfitable).toEqual([]);
  });

  it('should return total recipes count', async () => {
    // Créer 3 recettes pour le user
    await prisma.recipe.createMany({
      data: [
        { userId: testUser.id, name: 'Recette 1', servings: 1 },
        { userId: testUser.id, name: 'Recette 2', servings: 1 },
        { userId: testUser.id, name: 'Recette 3', servings: 1 },
      ]
    });

    const res = await request(app)
      .get('/stats')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.totalRecipes).toBe(3);
  });

  it('should return top 5 profitable recipes', async () => {
    // Créer des ingrédients
    const flour = await prisma.baseIngredient.create({
      data: {
        userId: testUser.id,
        name: 'Farine',
        
        pricePerUnit: 0.002,
        calories: 364,
        proteins: 10,
        carbs: 76,
        fats: 1
      }
    });

    const butter = await prisma.baseIngredient.create({
      data: {
        userId: testUser.id,
        name: 'Beurre',
        
        pricePerUnit: 0.01,
        calories: 717,
        proteins: 1,
        carbs: 1,
        fats: 81
      }
    });

    // Créer 6 recettes avec des coûts différents
    const recipes = [];
    for (let i = 1; i <= 6; i++) {
      const recipe = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: `Recette ${i}`,
          servings: 1
        }
      });

      // Ajouter ingrédients avec des quantités différentes
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          ingredientId: flour.id,
          quantity: i * 100,
          
          lossPercent: 0
        }
      });

      recipes.push(recipe);
    }

    const res = await request(app)
      .get('/stats')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.topProfitable).toHaveLength(5); // Maximum 5
    expect(res.body.topProfitable[0]).toHaveProperty('id');
    expect(res.body.topProfitable[0]).toHaveProperty('name');
    expect(res.body.topProfitable[0]).toHaveProperty('totalCost');
    expect(res.body.topProfitable[0]).toHaveProperty('margin');
    
    // Vérifier ordre décroissant par marge
    for (let i = 0; i < res.body.topProfitable.length - 1; i++) {
      expect(res.body.topProfitable[i].margin).toBeGreaterThanOrEqual(
        res.body.topProfitable[i + 1].margin
      );
    }
  });

  it('should only return user own recipes stats', async () => {
    const otherUser = 'other-user-456';
    
    // Créer recettes pour testUser
    await prisma.recipe.createMany({
      data: [
        { userId: testUser.id, name: 'My Recipe 1', servings: 1 },
        { userId: testUser.id, name: 'My Recipe 2', servings: 1 },
      ]
    });

    // Créer recettes pour autre user
    await prisma.recipe.createMany({
      data: [
        { userId: otherUser, name: 'Other Recipe 1', servings: 1 },
        { userId: otherUser, name: 'Other Recipe 2', servings: 1 },
        { userId: otherUser, name: 'Other Recipe 3', servings: 1 },
      ]
    });

    const res = await request(app)
      .get('/stats')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.totalRecipes).toBe(2); // Seulement les recettes du testUser
  });

  it('should fail without authentication', async () => {
    const res = await request(app)
      .get('/stats');
    
    expect(res.status).toBe(401);
  });
});

