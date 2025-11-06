import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

// Mock user pour les tests
const testUser = {
  id: 'test-user-id-123',
  email: 'chef@example.com'
};

const testUser2 = {
  id: 'test-user-id-456',
  email: 'chef2@example.com'
};

// Génération de tokens JWT pour l'authentification
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
};

let token;
let token2;

beforeAll(async () => {
  token = generateToken(testUser);
  token2 = generateToken(testUser2);
});

afterEach(async () => {
  // Nettoyage de la DB après chaque test
  // Ordre important: supprimer les relations avant les entités
  await prisma.recipeIngredient.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.recipe.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /', () => {
  it('should create a recipe with valid data', async () => {
    const recipeData = {
      name: 'Tarte aux Pommes',
      description: 'Une délicieuse tarte aux pommes maison',
      category: 'Dessert',
      servings: 6
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(recipeData.name);
    expect(response.body.description).toBe(recipeData.description);
    expect(response.body.category).toBe(recipeData.category);
    expect(response.body.servings).toBe(recipeData.servings);
    expect(response.body.userId).toBe(testUser.id);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  it('should create a recipe with minimal data (name only)', async () => {
    const recipeData = {
      name: 'Salade Verte'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(recipeData.name);
    expect(response.body.description).toBeNull();
    expect(response.body.category).toBeNull();
    expect(response.body.servings).toBe(1); // default
    expect(response.body.userId).toBe(testUser.id);
  });

  it('should fail when creating a recipe without authentication', async () => {
    const recipeData = {
      name: 'Tarte aux Pommes'
    };

    const response = await request(app)
      .post('/')
      .send(recipeData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail when creating a recipe without name', async () => {
    const recipeData = {
      description: 'Une tarte sans nom'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail when servings is not a positive number', async () => {
    const recipeData = {
      name: 'Tarte aux Pommes',
      servings: -5
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('GET /', () => {
  beforeEach(async () => {
    // Créer quelques recettes de test
    await prisma.recipe.createMany({
      data: [
        {
          userId: testUser.id,
          name: 'Tarte aux Pommes',
          description: 'Dessert traditionnel',
          category: 'Dessert',
          servings: 6
        },
        {
          userId: testUser.id,
          name: 'Boeuf Bourguignon',
          description: 'Plat mijoté',
          category: 'Plat Principal',
          servings: 4
        },
        {
          userId: testUser2.id,
          name: 'Salade César',
          description: 'Entrée fraîche',
          category: 'Entrée',
          servings: 2
        }
      ]
    });
  });

  it('should list all recipes for authenticated user', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('recipes');
    expect(response.body.recipes).toHaveLength(2); // Only user's recipes
    expect(response.body).toHaveProperty('total', 2);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('limit', 20);
  });

  it('should support pagination', async () => {
    const response = await request(app)
      .get('/?page=1&limit=1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.recipes).toHaveLength(1);
    expect(response.body.total).toBe(2);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(1);
  });

  it('should filter recipes by category', async () => {
    const response = await request(app)
      .get('/?category=Dessert')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.recipes).toHaveLength(1);
    expect(response.body.recipes[0].category).toBe('Dessert');
  });

  it('should fail when listing recipes without authentication', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(401);
  });
});

describe('GET //:id', () => {
  let recipe1;
  let recipe2;

  beforeEach(async () => {
    recipe1 = await prisma.recipe.create({
      data: {
        userId: testUser.id,
        name: 'Tarte aux Pommes',
        description: 'Dessert traditionnel',
        category: 'Dessert',
        servings: 6
      }
    });

    recipe2 = await prisma.recipe.create({
      data: {
        userId: testUser2.id,
        name: 'Salade César',
        description: 'Entrée fraîche',
        category: 'Entrée',
        servings: 2
      }
    });
  });

  it('should get a recipe by id', async () => {
    const response = await request(app)
      .get(`/${recipe1.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(recipe1.id);
    expect(response.body.name).toBe(recipe1.name);
    expect(response.body.description).toBe(recipe1.description);
  });

  it('should fail when getting another user\'s recipe', async () => {
    const response = await request(app)
      .get(`/${recipe2.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail when recipe does not exist', async () => {
    const response = await request(app)
      .get('//non-existent-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should fail when getting a recipe without authentication', async () => {
    const response = await request(app)
      .get(`/${recipe1.id}`);

    expect(response.status).toBe(401);
  });
});

describe('PUT //:id', () => {
  let recipe;

  beforeEach(async () => {
    recipe = await prisma.recipe.create({
      data: {
        userId: testUser.id,
        name: 'Tarte aux Pommes',
        description: 'Dessert traditionnel',
        category: 'Dessert',
        servings: 6
      }
    });
  });

  it('should update a recipe with valid data', async () => {
    const updateData = {
      name: 'Tarte aux Pommes Améliorée',
      description: 'Avec une touche de cannelle',
      servings: 8
    };

    const response = await request(app)
      .put(`/${recipe.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.description).toBe(updateData.description);
    expect(response.body.servings).toBe(updateData.servings);
    expect(response.body.category).toBe(recipe.category); // unchanged
  });

  it('should update only specified fields', async () => {
    const updateData = {
      description: 'Nouvelle description'
    };

    const response = await request(app)
      .put(`/${recipe.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.description).toBe(updateData.description);
    expect(response.body.name).toBe(recipe.name); // unchanged
  });

  it('should fail when updating another user\'s recipe', async () => {
    const response = await request(app)
      .put(`/${recipe.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ name: 'Hacked Recipe' });

    expect(response.status).toBe(404);
  });

  it('should fail when recipe does not exist', async () => {
    const response = await request(app)
      .put('//non-existent-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });

    expect(response.status).toBe(404);
  });

  it('should fail when updating with invalid data', async () => {
    const response = await request(app)
      .put(`/${recipe.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ servings: -10 });

    expect(response.status).toBe(400);
  });

  it('should fail when updating without authentication', async () => {
    const response = await request(app)
      .put(`/${recipe.id}`)
      .send({ name: 'New Name' });

    expect(response.status).toBe(401);
  });
});

describe('DELETE //:id', () => {
  let recipe;

  beforeEach(async () => {
    recipe = await prisma.recipe.create({
      data: {
        userId: testUser.id,
        name: 'Tarte aux Pommes',
        description: 'Dessert traditionnel',
        category: 'Dessert',
        servings: 6
      }
    });
  });

  it('should delete a recipe', async () => {
    const response = await request(app)
      .delete(`/${recipe.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');

    // Verify it's deleted
    const deleted = await prisma.recipe.findUnique({
      where: { id: recipe.id }
    });
    expect(deleted).toBeNull();
  });

  it('should fail when deleting another user\'s recipe', async () => {
    const response = await request(app)
      .delete(`/${recipe.id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(response.status).toBe(404);

    // Verify it's not deleted
    const notDeleted = await prisma.recipe.findUnique({
      where: { id: recipe.id }
    });
    expect(notDeleted).not.toBeNull();
  });

  it('should fail when recipe does not exist', async () => {
    const response = await request(app)
      .delete('//non-existent-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should fail when deleting without authentication', async () => {
    const response = await request(app)
      .delete(`/${recipe.id}`);

    expect(response.status).toBe(401);
  });
});
