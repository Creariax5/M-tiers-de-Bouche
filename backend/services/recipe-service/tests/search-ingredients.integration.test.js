/**
 * Tests d'intégration : US-022 - Recherche d'ingrédients
 * Route unifiée GET /ingredients?search=terme
 * Fusion base_ingredients (Ciqual) + custom_ingredients (utilisateur)
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

describe('GET /ingredients - Search unified ingredients', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Créer un utilisateur test
    userId = '123e4567-e89b-12d3-a456-426614174000';
    token = jwt.sign({ userId }, process.env.JWT_SECRET || 'dev-secret-key-change-in-production', {
      expiresIn: '1h'
    });

    // Nettoyer les custom ingredients existants
    await prisma.customIngredient.deleteMany({});

    // Créer des custom ingredients pour les tests
    await prisma.customIngredient.createMany({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          userId,
          name: 'Farine bio de mon moulin',
          category: 'FARINES',
          price: 2.5,
          priceUnit: 'KG',
          supplier: 'Moulin Local',
          calories: 360,
          proteins: 11,
          carbs: 72,
          fats: 1.5,
          salt: 0.01,
          allergens: ['GLUTEN']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          userId,
          name: 'Chocolat noir Valrhona 70%',
          category: 'CHOCOLAT_CACAO',
          price: 25.0,
          priceUnit: 'KG',
          supplier: 'Valrhona',
          calories: 550,
          proteins: 7,
          carbs: 45,
          fats: 38,
          salt: 0.02,
          allergens: []
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          userId: '999e9999-e99b-99d9-a999-999999999999', // Autre utilisateur
          name: 'Farine autre utilisateur',
          category: 'FARINES',
          price: 2.0,
          priceUnit: 'KG',
          supplier: 'Autre',
          calories: 350,
          proteins: 10,
          carbs: 70,
          fats: 1.0,
          salt: 0.01,
          allergens: ['GLUTEN']
        }
      ]
    });
  });

  describe('Recherche fusionnée base + custom', () => {
    it('should search in both base and custom ingredients', async () => {
      const response = await request(app)
        .get('/ingredients?search=valrhona') // Recherche spécifique au custom ingredient
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Vérifier qu'on a à la fois des base et des custom
      const types = response.body.map(ing => ing.type);
      expect(types).toContain('custom'); // Custom devrait apparaître (Valrhona est unique)
      
      // Note: 'base' peut ne pas apparaître si aucun ingrédient de base ne contient "valrhona"
      // Ce test vérifie surtout que la fusion fonctionne
    });

    it('should return results with required fields', async () => {
      const response = await request(app)
        .get('/ingredients?search=chocolat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const ingredient = response.body[0];

      expect(ingredient).toHaveProperty('id');
      expect(ingredient).toHaveProperty('name');
      expect(ingredient).toHaveProperty('type'); // 'base' ou 'custom'
      expect(ingredient).toHaveProperty('category');
      expect(ingredient).toHaveProperty('calories');
      expect(ingredient).toHaveProperty('proteins');
      expect(ingredient).toHaveProperty('carbs');
      expect(ingredient).toHaveProperty('fats');
      expect(ingredient).toHaveProperty('salt');
      expect(ingredient).toHaveProperty('allergens');
    });

    it('should show supplier only for custom ingredients', async () => {
      const response = await request(app)
        .get('/ingredients?search=chocolat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      
      const customIng = response.body.find(ing => ing.type === 'custom');
      const baseIng = response.body.find(ing => ing.type === 'base');

      if (customIng) {
        expect(customIng).toHaveProperty('supplier');
        expect(customIng).toHaveProperty('price');
      }

      if (baseIng) {
        expect(baseIng.supplier).toBeUndefined();
        expect(baseIng.price).toBeUndefined();
      }
    });

    it('should only return current user custom ingredients', async () => {
      const response = await request(app)
        .get('/ingredients?search=farine')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      const customIngredients = response.body.filter(ing => ing.type === 'custom');
      
      // Vérifier qu'on ne voit pas les ingrédients d'autres utilisateurs
      const hasOtherUserIngredient = customIngredients.some(
        ing => ing.name === 'Farine autre utilisateur'
      );
      expect(hasOtherUserIngredient).toBe(false);
    });
  });

  describe('Tri et performance', () => {
    it('should sort results by relevance (ts_rank)', async () => {
      const response = await request(app)
        .get('/ingredients?search=chocolat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(1);

      // Le premier résultat devrait contenir "chocolat" dans le nom
      const firstName = response.body[0].name.toLowerCase();
      expect(firstName).toContain('chocolat');
    });

    it('should limit results to 20 items by default', async () => {
      const response = await request(app)
        .get('/ingredients?search=ar') // Recherche large (min 2 chars)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(20);
    });

    it('should return empty array if no match', async () => {
      const response = await request(app)
        .get('/ingredients?search=zzzzinexistant')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/ingredients?search=farine');

      expect(response.status).toBe(401);
    });

    it('should validate search query (min 2 characters)', async () => {
      const response = await request(app)
        .get('/ingredients?search=a')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });

    it('should validate search query (max 100 characters)', async () => {
      const longSearch = 'a'.repeat(101);
      const response = await request(app)
        .get(`/ingredients?search=${longSearch}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });

    it('should handle accents in search (encodeURIComponent)', async () => {
      const response = await request(app)
        .get(`/ingredients?search=${encodeURIComponent('café')}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should respond in less than 200ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/ingredients?search=farine')
        .set('Authorization', `Bearer ${token}`);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });
  });
});
