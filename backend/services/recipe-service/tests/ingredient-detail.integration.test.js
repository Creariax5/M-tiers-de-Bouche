/**
 * Tests d'intégration : US-023 - Détail ingrédient
 * Route GET /ingredients/:id
 * Retourne base_ingredient OU custom_ingredient selon l'ID
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

describe('GET /ingredients/:id - Ingredient detail', () => {
  let token;
  let userId;
  let baseIngredientId;
  let customIngredientId;
  let otherUserCustomId;

  beforeAll(async () => {
    // Créer un utilisateur test
    userId = '123e4567-e89b-12d3-a456-426614174000';
    token = jwt.sign({ userId }, process.env.JWT_SECRET || 'dev-secret-key-change-in-production', {
      expiresIn: '1h'
    });

    // Récupérer un base ingredient de la seed
    const baseIngredient = await prisma.baseIngredient.findFirst({
      where: { name: { contains: 'Farine' } }
    });
    baseIngredientId = baseIngredient?.id;

    // Nettoyer et créer custom ingredients de test
    await prisma.customIngredient.deleteMany({});

    const customIngredients = await prisma.customIngredient.createMany({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          userId,
          name: 'Mon ingrédient custom',
          category: 'FARINES',
          price: 3.5,
          priceUnit: 'KG',
          supplier: 'Fournisseur Local',
          lotNumber: 'LOT-2024-001',
          calories: 350,
          proteins: 12,
          carbs: 70,
          fats: 2,
          salt: 0.01,
          allergens: ['GLUTEN']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          userId: '999e9999-e99b-99d9-a999-999999999999', // Autre utilisateur
          name: 'Ingrédient autre user',
          category: 'CHOCOLAT_CACAO',
          price: 25.0,
          priceUnit: 'KG',
          supplier: 'Autre',
          calories: 500,
          proteins: 5,
          carbs: 50,
          fats: 30,
          salt: 0.02,
          allergens: []
        }
      ]
    });

    customIngredientId = '550e8400-e29b-41d4-a716-446655440001';
    otherUserCustomId = '550e8400-e29b-41d4-a716-446655440002';
  });

  afterAll(async () => {
    await prisma.customIngredient.deleteMany({});
  });

  describe('Base Ingredients', () => {
    it('should return base ingredient details', async () => {
      const response = await request(app)
        .get(`/ingredients/${baseIngredientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', baseIngredientId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('calories');
      expect(response.body).toHaveProperty('proteins');
      expect(response.body).toHaveProperty('carbs');
      expect(response.body).toHaveProperty('fats');
      expect(response.body).toHaveProperty('salt');
      expect(response.body).toHaveProperty('allergens');
      expect(response.body).toHaveProperty('type', 'base');
      expect(response.body.ciqualCode).toBeDefined();
      
      // Les base ingredients n'ont PAS de supplier
      expect(response.body.supplier).toBeUndefined();
      expect(response.body.price).toBeUndefined();
    });
  });

  describe('Custom Ingredients', () => {
    it('should return custom ingredient details for owner', async () => {
      const response = await request(app)
        .get(`/ingredients/${customIngredientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', customIngredientId);
      expect(response.body).toHaveProperty('name', 'Mon ingrédient custom');
      expect(response.body).toHaveProperty('category', 'FARINES');
      expect(response.body).toHaveProperty('type', 'custom');
      
      // Custom ingredients ont price + supplier
      expect(response.body).toHaveProperty('price', 3.5);
      expect(response.body).toHaveProperty('priceUnit', 'KG');
      expect(response.body).toHaveProperty('supplier', 'Fournisseur Local');
      expect(response.body).toHaveProperty('lotNumber', 'LOT-2024-001');
      
      // Valeurs nutritionnelles
      expect(response.body).toHaveProperty('calories', 350);
      expect(response.body).toHaveProperty('proteins', 12);
      expect(response.body).toHaveProperty('allergens');
      expect(response.body.allergens).toContain('GLUTEN');
    });

    it('should return 404 for custom ingredient of another user', async () => {
      const response = await request(app)
        .get(`/ingredients/${otherUserCustomId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/ingredients/${baseIngredientId}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent ingredient', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/ingredients/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate UUID format', async () => {
      const response = await request(app)
        .get('/ingredients/invalid-uuid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
