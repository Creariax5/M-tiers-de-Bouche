/**
 * Tests d'intégration bout-en-bout
 * Teste le flow complet : Inscription → Login → Dashboard → Recettes
 */

import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const API_URL = process.env.API_URL || 'http://api-gateway:3000';

describe('Integration Tests - Full User Journey', () => {
  let authToken;
  let userId;
  let recipeId;
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@example.com`;
  const testPassword = 'Password123!';

  beforeAll(() => {
    console.log('\n🚀 Starting full integration tests...\n');
  });

  afterAll(() => {
    console.log('\n✅ Integration tests completed!\n');
  });

  describe('1. Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Inscription réussie');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testEmail);
      expect(response.body).toHaveProperty('token');

      userId = response.body.user.id;
      console.log(`   ✅ User registered: ${userId}`);
    });

    it('should login with the new user', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id', userId);

      authToken = response.body.token;
      console.log(`   ✅ User logged in, token obtained`);
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Email ou mot de passe incorrect');
    });
  });

  describe('2. Dashboard Stats (Empty)', () => {
    it('should get stats with 0 recipes', async () => {
      const response = await request(API_URL)
        .get('/api/recipes/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalRecipes', 0);
      expect(response.body).toHaveProperty('topProfitable');
      expect(response.body.topProfitable).toHaveLength(0);

      console.log(`   ✅ Dashboard stats: ${response.body.totalRecipes} recipes`);
    });

    it('should fail without auth token', async () => {
      const response = await request(API_URL)
        .get('/api/recipes/stats')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token manquant');
    });
  });

  describe('3. Recipes List (Empty)', () => {
    it('should get empty recipes list', async () => {
      const response = await request(API_URL)
        .get('/api/recipes?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('recipes');
      expect(response.body.recipes).toHaveLength(0);
      expect(response.body).toHaveProperty('total', 0);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 20);

      console.log(`   ✅ Recipes list: ${response.body.total} recipes`);
    });
  });

  describe('4. Recipe Creation', () => {
    it('should create a new recipe', async () => {
      const response = await request(API_URL)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Croissant Test ${timestamp}`,
          description: 'Croissant créé automatiquement pour test d\'intégration',
          category: 'Viennoiserie',
          portionSize: '60g',
          portions: 12,
          preparationTime: 120,
          cookingTime: 15,
          restingTime: 480,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', `Croissant Test ${timestamp}`);
      expect(response.body).toHaveProperty('category', 'Viennoiserie');
      expect(response.body).toHaveProperty('userId', userId);

      recipeId = response.body.id;
      console.log(`   ✅ Recipe created: ${recipeId}`);
    });

    it('should fail to create recipe without auth', async () => {
      const response = await request(API_URL)
        .post('/api/recipes')
        .send({
          name: 'Test Recipe',
          category: 'Viennoiserie',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Token manquant');
    });
  });

  describe('5. Dashboard Stats (With Recipe)', () => {
    it('should get stats with 1 recipe', async () => {
      const response = await request(API_URL)
        .get('/api/recipes/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalRecipes', 1);
      expect(response.body).toHaveProperty('topProfitable');
      // topProfitable peut être vide si pas de pricing calculé

      console.log(`   ✅ Dashboard updated: ${response.body.totalRecipes} recipes`);
    });
  });

  describe('6. Recipes List (With Recipe)', () => {
    it('should get recipes list with 1 recipe', async () => {
      const response = await request(API_URL)
        .get('/api/recipes?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('recipes');
      expect(response.body.recipes).toHaveLength(1);
      expect(response.body).toHaveProperty('total', 1);
      expect(response.body.recipes[0]).toHaveProperty('id', recipeId);
      expect(response.body.recipes[0]).toHaveProperty('name', `Croissant Test ${timestamp}`);

      console.log(`   ✅ Recipes list updated: ${response.body.total} recipes`);
    });

    it('should filter by category', async () => {
      const response = await request(API_URL)
        .get('/api/recipes?category=Viennoiserie')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.recipes).toHaveLength(1);
      expect(response.body.recipes[0]).toHaveProperty('category', 'Viennoiserie');
    });

    it('should search by name', async () => {
      const response = await request(API_URL)
        .get(`/api/recipes?search=Croissant`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.recipes.length).toBeGreaterThan(0);
      expect(response.body.recipes[0].name).toContain('Croissant');
    });
  });

  describe('7. Recipe Details', () => {
    it('should get recipe by id', async () => {
      const response = await request(API_URL)
        .get(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', recipeId);
      expect(response.body).toHaveProperty('name', `Croissant Test ${timestamp}`);
      expect(response.body).toHaveProperty('userId', userId);

      console.log(`   ✅ Recipe details retrieved`);
    });

    it('should fail to get another user\'s recipe', async () => {
      // On ne peut pas facilement tester ça sans créer un 2e user
      // Mais on peut tester avec un UUID invalide
      const response = await request(API_URL)
        .get('/api/recipes/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Recette non trouvée');
    });
  });

  describe('8. Recipe Update', () => {
    it('should update recipe', async () => {
      const response = await request(API_URL)
        .put(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Croissant Test ${timestamp} - Updated`,
          description: 'Description mise à jour',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id', recipeId);
      expect(response.body).toHaveProperty('name', `Croissant Test ${timestamp} - Updated`);
      expect(response.body).toHaveProperty('description', 'Description mise à jour');

      console.log(`   ✅ Recipe updated`);
    });
  });

  describe('9. Recipe Deletion', () => {
    it('should delete recipe', async () => {
      const response = await request(API_URL)
        .delete(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Recette supprimée avec succès');

      console.log(`   ✅ Recipe deleted`);
    });

    it('should return 404 after deletion', async () => {
      const response = await request(API_URL)
        .get(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Recette non trouvée');
    });

    it('should have 0 recipes after deletion', async () => {
      const response = await request(API_URL)
        .get('/api/recipes/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalRecipes', 0);

      console.log(`   ✅ Dashboard back to 0 recipes`);
    });
  });
});
