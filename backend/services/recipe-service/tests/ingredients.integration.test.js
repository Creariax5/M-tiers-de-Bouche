import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const testUser = {
  id: 'test-user-id-123',
  email: 'chef@example.com'
};

const testUser2 = {
  id: 'test-user-id-456',
  email: 'chef2@example.com'
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

let token;
let token2;
let testRecipe;
let testIngredient;

beforeAll(async () => {
  token = generateToken(testUser);
  token2 = generateToken(testUser2);
});

beforeEach(async () => {
  // Créer une recette de test
  testRecipe = await prisma.recipe.create({
    data: {
      userId: testUser.id,
      name: 'Tarte aux Pommes Test',
      servings: 6
    }
  });

  // Créer un ingrédient de test
  testIngredient = await prisma.baseIngredient.create({
    data: {
      
      name: 'Farine T55',
      
      pricePerUnit: 0.002,
      calories: 364,
      proteins: 10,
      carbs: 76,
      fats: 1.5,
      allergens: 'gluten'
    }
  });
});

afterEach(async () => {
  // Ordre important: supprimer les relations avant les entités
  await prisma.recipeIngredient.deleteMany({});
  await prisma.baseIngredient.deleteMany({});
  await prisma.recipe.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST //:id/ingredients', () => {
  it('should add an ingredient to a recipe', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: 500,
      
      lossPercent: 5
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token}`)
      .send(ingredientData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.recipeId).toBe(testRecipe.id);
    expect(response.body.ingredientId).toBe(testIngredient.id);
    expect(response.body.quantity).toBe(500);
    expect(response.body.unit).toBe('g');
    expect(response.body.lossPercent).toBe(5);
    expect(response.body).toHaveProperty('ingredient');
    expect(response.body.ingredient.name).toBe('Farine T55');
  });

  it('should add an ingredient with default loss percent (0)', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: 200,
      unit: 'g'
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token}`)
      .send(ingredientData);

    expect(response.status).toBe(201);
    expect(response.body.lossPercent).toBe(0);
  });

  it('should fail when recipe does not belong to user', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: 500,
      unit: 'g'
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token2}`)
      .send(ingredientData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail when recipe does not exist', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: 500,
      unit: 'g'
    };

    const response = await request(app)
      .post('//non-existent-id/ingredients')
      .set('Authorization', `Bearer ${token}`)
      .send(ingredientData);

    expect(response.status).toBe(404);
  });

  it('should fail when ingredient does not exist', async () => {
    const ingredientData = {
      ingredientId: '00000000-0000-0000-0000-000000000000', // UUID valide mais inexistant
      quantity: 500,
      unit: 'g'
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token}`)
      .send(ingredientData);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('Ingrédient');
  });

  it('should fail with invalid quantity (negative)', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: -100,
      unit: 'g'
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token}`)
      .send(ingredientData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail with invalid loss percent (>100)', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: 500,
      
      lossPercent: 150
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token}`)
      .send(ingredientData);

    expect(response.status).toBe(400);
  });

  it('should fail without authentication', async () => {
    const ingredientData = {
      ingredientId: testIngredient.id,
      quantity: 500,
      unit: 'g'
    };

    const response = await request(app)
      .post(`/${testRecipe.id}/ingredients`)
      .send(ingredientData);

    expect(response.status).toBe(401);
  });
});

describe('GET //:id/ingredients', () => {
  beforeEach(async () => {
    // Ajouter quelques ingrédients à la recette
    const ingredient2 = await prisma.baseIngredient.create({
      data: {
        
        name: 'Sucre',
        
        pricePerUnit: 0.001,
        calories: 400,
        carbs: 100
      }
    });

    await prisma.recipeIngredient.createMany({
      data: [
        {
          recipeId: testRecipe.id,
          ingredientId: testIngredient.id,
          quantity: 500,
          
          lossPercent: 5
        },
        {
          recipeId: testRecipe.id,
          ingredientId: ingredient2.id,
          quantity: 200,
          
          lossPercent: 0
        }
      ]
    });
  });

  it('should list all ingredients of a recipe', async () => {
    const response = await request(app)
      .get(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('ingredient');
    expect(response.body[0].ingredient).toHaveProperty('name');
  });

  it('should fail when recipe does not belong to user', async () => {
    const response = await request(app)
      .get(`/${testRecipe.id}/ingredients`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(404);
  });

  it('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/${testRecipe.id}/ingredients`);

    expect(response.status).toBe(401);
  });
});

describe('DELETE //:id/ingredients/:ingredientId', () => {
  let recipeIngredient;

  beforeEach(async () => {
    recipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: testIngredient.id,
        quantity: 500,
        
        lossPercent: 5
      }
    });
  });

  it('should delete an ingredient from a recipe', async () => {
    const response = await request(app)
      .delete(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');

    // Vérifier que l'ingrédient a été supprimé
    const deleted = await prisma.recipeIngredient.findUnique({
      where: { id: recipeIngredient.id }
    });
    expect(deleted).toBeNull();
  });

  it('should fail when recipe does not belong to user', async () => {
    const response = await request(app)
      .delete(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(404);

    // Vérifier que l'ingrédient n'a pas été supprimé
    const notDeleted = await prisma.recipeIngredient.findUnique({
      where: { id: recipeIngredient.id }
    });
    expect(notDeleted).not.toBeNull();
  });

  it('should fail when recipe ingredient does not exist', async () => {
    const response = await request(app)
      .delete(`/${testRecipe.id}/ingredients/non-existent-id`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should fail without authentication', async () => {
    const response = await request(app)
      .delete(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`);

    expect(response.status).toBe(401);
  });
});

describe('PUT //:id/ingredients/:ingredientId', () => {
  let recipeIngredient;

  beforeEach(async () => {
    recipeIngredient = await prisma.recipeIngredient.create({
      data: {
        recipeId: testRecipe.id,
        ingredientId: testIngredient.id,
        quantity: 500,
        
        lossPercent: 5
      }
    });
  });

  it('should update ingredient quantity and loss percent', async () => {
    const updateData = {
      quantity: 750,
      lossPercent: 10
    };

    const response = await request(app)
      .put(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(750);
    expect(response.body.lossPercent).toBe(10);
  });

  it('should fail when recipe does not belong to user', async () => {
    const updateData = {
      quantity: 750
    };

    const response = await request(app)
      .put(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send(updateData);

    expect(response.status).toBe(404);
  });

  it('should fail with invalid quantity', async () => {
    const updateData = {
      quantity: -100
    };

    const response = await request(app)
      .put(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(400);
  });

  it('should fail without authentication', async () => {
    const updateData = {
      quantity: 750
    };

    const response = await request(app)
      .put(`/${testRecipe.id}/ingredients/${recipeIngredient.id}`)
      .send(updateData);

    expect(response.status).toBe(401);
  });
});

