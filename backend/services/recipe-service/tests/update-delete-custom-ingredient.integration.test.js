/**
 * Tests d'intégration pour PUT/DELETE /ingredients/custom/:id
 * US-025 : Modification/suppression ingrédient personnalisé
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

describe('PUT/DELETE /ingredients/custom/:id - Update/Delete custom ingredient', () => {
  let token;
  let userId;
  let otherUserToken;
  let otherUserId;
  let testIngredientId;
  let otherUserIngredientId;

  beforeAll(async () => {
    // User 1 (test user)
    userId = '123e4567-e89b-12d3-a456-426614174000';
    token = jwt.sign({ userId, email: 'test@example.com' }, JWT_SECRET, { expiresIn: '1h' });

    // User 2 (other user for isolation tests)
    otherUserId = '999e4567-e89b-12d3-a456-426614174999';
    otherUserToken = jwt.sign({ userId: otherUserId, email: 'other@example.com' }, JWT_SECRET, { expiresIn: '1h' });

    // Créer un ingrédient pour le test user
    const testIngredient = await prisma.customIngredient.create({
      data: {
        userId,
        name: 'Ingrédient de test à modifier',
        category: 'FARINES',
        price: 5.00,
        priceUnit: 'KG',
        supplier: 'Fournisseur Initial',
        lotNumber: 'LOT-001',
        calories: 350
      }
    });
    testIngredientId = testIngredient.id;

    // Créer un ingrédient pour l'autre user (isolation)
    const otherIngredient = await prisma.customIngredient.create({
      data: {
        userId: otherUserId,
        name: 'Ingrédient autre utilisateur',
        category: 'SUCRES',
        price: 3.00,
        priceUnit: 'KG'
      }
    });
    otherUserIngredientId = otherIngredient.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.customIngredient.deleteMany({
      where: {
        OR: [
          { userId },
          { userId: otherUserId }
        ]
      }
    });
    await prisma.$disconnect();
  });

  describe('PUT /ingredients/custom/:id - Update', () => {
    describe('Valid updates', () => {
      it('should update custom ingredient name', async () => {
        const updateData = {
          name: 'Ingrédient modifié'
        };

        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: testIngredientId,
          userId,
          name: 'Ingrédient modifié',
          category: 'FARINES', // Unchanged
          price: 5.00 // Unchanged
        });

        // Verify in DB
        const ingredient = await prisma.customIngredient.findUnique({
          where: { id: testIngredientId }
        });
        expect(ingredient.name).toBe('Ingrédient modifié');
      });

      it('should update multiple fields at once', async () => {
        const updateData = {
          name: 'Farine T65 Premium',
          price: 6.50,
          supplier: 'Nouveau Fournisseur',
          lotNumber: 'LOT-2025-NEW',
          calories: 365
        };

        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: testIngredientId,
          name: updateData.name,
          price: updateData.price,
          supplier: updateData.supplier,
          lotNumber: updateData.lotNumber,
          calories: updateData.calories
        });
      });

      it('should update nutritional values', async () => {
        const updateData = {
          proteins: 12.5,
          carbs: 70.0,
          fats: 2.5,
          sugars: 1.0,
          salt: 0.01
        };

        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: testIngredientId,
          proteins: updateData.proteins,
          carbs: updateData.carbs,
          fats: updateData.fats,
          sugars: updateData.sugars,
          salt: updateData.salt
        });
      });

      it('should update allergens', async () => {
        const updateData = {
          allergens: ['GLUTEN', 'LUPIN']
        };

        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);

        expect(response.body.allergens).toEqual(['GLUTEN', 'LUPIN']);
      });

      it('should update expiry date', async () => {
        const updateData = {
          expiryDate: '2026-06-30T23:59:59.000Z'
        };

        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);

        expect(response.body.expiryDate).toBe(updateData.expiryDate);
      });
    });

    describe('Validation errors', () => {
      it('should require authentication', async () => {
        await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .send({ name: 'Test' })
          .expect(401);
      });

      it('should validate UUID format', async () => {
        const response = await request(app)
          .put('/ingredients/custom/invalid-uuid')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Test' })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should reject invalid category', async () => {
        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ category: 'INVALID_CATEGORY' })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should reject negative price', async () => {
        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ price: -10.00 })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should reject invalid priceUnit', async () => {
        const response = await request(app)
          .put(`/ingredients/custom/${testIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ priceUnit: 'INVALID_UNIT' })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('User isolation', () => {
      it('should return 404 for non-existent ingredient', async () => {
        const fakeId = '550e8400-e29b-41d4-a716-446655440099';
        
        await request(app)
          .put(`/ingredients/custom/${fakeId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Test' })
          .expect(404);
      });

      it('should return 403 when trying to update another user ingredient', async () => {
        const response = await request(app)
          .put(`/ingredients/custom/${otherUserIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Tentative de modification' })
          .expect(403);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('not authorized');
      });

      it('should preserve ingredient data when update fails due to authorization', async () => {
        // Verify other user's ingredient is unchanged
        const ingredient = await prisma.customIngredient.findUnique({
          where: { id: otherUserIngredientId }
        });
        expect(ingredient.name).toBe('Ingrédient autre utilisateur');
        expect(ingredient.userId).toBe(otherUserId);
      });
    });
  });

  describe('DELETE /ingredients/custom/:id - Delete', () => {
    let ingredientToDelete;

    beforeEach(async () => {
      // Créer un nouvel ingrédient pour chaque test de suppression
      ingredientToDelete = await prisma.customIngredient.create({
        data: {
          userId,
          name: 'Ingrédient à supprimer',
          category: 'AUTRE',
          price: 1.00,
          priceUnit: 'KG'
        }
      });
    });

    describe('Valid deletion', () => {
      it('should delete custom ingredient', async () => {
        await request(app)
          .delete(`/ingredients/custom/${ingredientToDelete.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204);

        // Verify deletion in DB
        const ingredient = await prisma.customIngredient.findUnique({
          where: { id: ingredientToDelete.id }
        });
        expect(ingredient).toBeNull();
      });

      it('should return 204 with no content', async () => {
        const response = await request(app)
          .delete(`/ingredients/custom/${ingredientToDelete.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204);

        expect(response.body).toEqual({});
      });
    });

    describe('Validation errors', () => {
      it('should require authentication', async () => {
        await request(app)
          .delete(`/ingredients/custom/${ingredientToDelete.id}`)
          .expect(401);
      });

      it('should validate UUID format', async () => {
        const response = await request(app)
          .delete('/ingredients/custom/invalid-uuid')
          .set('Authorization', `Bearer ${token}`)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });

      it('should return 404 for non-existent ingredient', async () => {
        const fakeId = '550e8400-e29b-41d4-a716-446655440088';
        
        await request(app)
          .delete(`/ingredients/custom/${fakeId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });

    describe('User isolation', () => {
      it('should return 403 when trying to delete another user ingredient', async () => {
        const response = await request(app)
          .delete(`/ingredients/custom/${otherUserIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('not authorized');
      });

      it('should not delete ingredient when authorization fails', async () => {
        await request(app)
          .delete(`/ingredients/custom/${otherUserIngredientId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        // Verify ingredient still exists
        const ingredient = await prisma.customIngredient.findUnique({
          where: { id: otherUserIngredientId }
        });
        expect(ingredient).toBeTruthy();
        expect(ingredient.name).toBe('Ingrédient autre utilisateur');
      });
    });
  });
});
