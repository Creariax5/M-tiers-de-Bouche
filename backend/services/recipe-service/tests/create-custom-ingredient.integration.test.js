/**
 * Tests d'intégration pour POST /ingredients/custom
 * US-024 : Création ingrédient personnalisé
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

describe('POST /ingredients/custom - Create custom ingredient', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // User ID pour les tests
    userId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Token JWT valide
    token = jwt.sign(
      { userId, email: 'test@example.com' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Cleanup : supprimer les ingrédients créés pendant les tests
    await prisma.customIngredient.deleteMany({
      where: { userId }
    });
    await prisma.$disconnect();
  });

  describe('Valid creation', () => {
    it('should create a custom ingredient with all required fields', async () => {
      const ingredientData = {
        name: 'Farine T65 Bio Fournisseur X',
        category: 'FARINES',
        price: 2.50,
        priceUnit: 'KG'
      };

      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send(ingredientData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId,
        name: ingredientData.name,
        category: ingredientData.category,
        price: ingredientData.price,
        priceUnit: ingredientData.priceUnit,
        allergens: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // Vérifier en DB
      const ingredient = await prisma.customIngredient.findUnique({
        where: { id: response.body.id }
      });
      expect(ingredient).toBeTruthy();
      expect(ingredient.userId).toBe(userId);
    });

    it('should create a custom ingredient with optional fields (supplier, lot, expiry)', async () => {
      const ingredientData = {
        name: 'Beurre AOP Charentes-Poitou',
        category: 'MATIERES_GRASSES',
        price: 8.50,
        priceUnit: 'KG',
        supplier: 'Laiterie Coopérative du Poitou',
        lotNumber: 'LOT-2025-001234',
        expiryDate: '2025-12-31T23:59:59.000Z'
      };

      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send(ingredientData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        userId,
        name: ingredientData.name,
        supplier: ingredientData.supplier,
        lotNumber: ingredientData.lotNumber,
        expiryDate: ingredientData.expiryDate
      });
    });

    it('should create a custom ingredient with nutritional values', async () => {
      const ingredientData = {
        name: 'Chocolat noir 70% Valrhona',
        category: 'CHOCOLAT_CACAO',
        price: 15.00,
        priceUnit: 'KG',
        calories: 550,
        proteins: 7.5,
        carbs: 45.0,
        sugars: 30.0,
        fats: 35.0,
        saturatedFats: 20.0,
        salt: 0.05
      };

      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send(ingredientData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: ingredientData.name,
        calories: ingredientData.calories,
        proteins: ingredientData.proteins,
        carbs: ingredientData.carbs,
        sugars: ingredientData.sugars,
        fats: ingredientData.fats,
        saturatedFats: ingredientData.saturatedFats,
        salt: ingredientData.salt
      });
    });

    it('should create a custom ingredient with allergens', async () => {
      const ingredientData = {
        name: 'Pâte de noisettes bio',
        category: 'FRUITS_SECS',
        price: 12.00,
        priceUnit: 'KG',
        allergens: ['FRUITS_A_COQUE']
      };

      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send(ingredientData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: ingredientData.name,
        allergens: ['FRUITS_A_COQUE']
      });
    });
  });

  describe('Validation errors', () => {
    it('should require authentication', async () => {
      const ingredientData = {
        name: 'Test ingredient',
        category: 'FARINES',
        price: 2.50,
        priceUnit: 'KG'
      };

      await request(app)
        .post('/ingredients/custom')
        .send(ingredientData)
        .expect(401);
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Incomplete ingredient'
          // Missing: category, price, priceUnit
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid category', async () => {
      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Invalid category',
          category: 'INVALID_CATEGORY',
          price: 2.50,
          priceUnit: 'KG'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject negative price', async () => {
      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Negative price ingredient',
          category: 'FARINES',
          price: -5.00,
          priceUnit: 'KG'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid priceUnit', async () => {
      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Invalid unit',
          category: 'FARINES',
          price: 2.50,
          priceUnit: 'INVALID_UNIT'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject name too short', async () => {
      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'A',
          category: 'FARINES',
          price: 2.50,
          priceUnit: 'KG'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject negative nutritional values', async () => {
      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Invalid nutrition',
          category: 'FARINES',
          price: 2.50,
          priceUnit: 'KG',
          calories: -100
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('User isolation', () => {
    it('should link custom ingredient to authenticated user', async () => {
      const ingredientData = {
        name: 'User-specific ingredient',
        category: 'AUTRE',
        price: 5.00,
        priceUnit: 'KG'
      };

      const response = await request(app)
        .post('/ingredients/custom')
        .set('Authorization', `Bearer ${token}`)
        .send(ingredientData)
        .expect(201);

      expect(response.body.userId).toBe(userId);

      // Vérifier que l'ingrédient est bien lié au user
      const ingredient = await prisma.customIngredient.findUnique({
        where: { id: response.body.id }
      });
      expect(ingredient.userId).toBe(userId);
    });
  });
});
