import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

describe('GET /ingredients/custom - List custom ingredients', () => {
  let token1, token2;
  const userId1 = 'user-123';
  const userId2 = 'user-456';

  beforeAll(() => {
    token1 = jwt.sign({ userId: userId1 }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
    token2 = jwt.sign({ userId: userId2 }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
  });

  beforeEach(async () => {
    // Nettoyer les données de test
    await prisma.customIngredient.deleteMany({
      where: { userId: { in: [userId1, userId2] } },
    });
  });

  afterAll(async () => {
    await prisma.customIngredient.deleteMany({
      where: { userId: { in: [userId1, userId2] } },
    });
    await prisma.$disconnect();
  });

  describe('Authentication', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/ingredients/custom');
      expect(res.status).toBe(401);
    });

    it('should return 403 if invalid token', async () => {
      const res = await request(app)
        .get('/ingredients/custom')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(403);
    });
  });

  describe('Success cases', () => {
    it('should return empty array if no custom ingredients', async () => {
      const res = await request(app)
        .get('/ingredients/custom')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return user custom ingredients only', async () => {
      // Créer ingrédients pour user1
      const ingredient1 = await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Farine bio',
          category: 'FARINES',
          price: 3.50,
          priceUnit: 'KG',
          supplier: 'Bio Market',
        },
      });

      const ingredient2 = await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Chocolat 70%',
          category: 'CHOCOLAT_CACAO',
          price: 12.00,
          priceUnit: 'KG',
        },
      });

      // Créer ingrédient pour user2 (ne doit PAS apparaître)
      await prisma.customIngredient.create({
        data: {
          userId: userId2,
          name: 'Sucre roux',
          category: 'SUCRES',
          price: 2.00,
          priceUnit: 'KG',
        },
      });

      const res = await request(app)
        .get('/ingredients/custom')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('Chocolat 70%');
      expect(res.body[1].name).toBe('Farine bio');
      expect(res.body.every(ing => ing.userId === userId1)).toBe(true);
    });

    it('should return all fields including traçabilité', async () => {
      await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Beurre AOP',
          category: 'MATIERES_GRASSES',
          price: 8.50,
          priceUnit: 'KG',
          supplier: 'Laiterie du terroir',
          lotNumber: 'LOT-2025-001',
          expiryDate: new Date('2025-12-31'),
          calories: 750,
          proteins: 0.5,
          carbs: 0.3,
          fats: 82.0,
          allergens: ['lait'],
        },
      });

      const res = await request(app)
        .get('/ingredients/custom')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      
      const ingredient = res.body[0];
      expect(ingredient.name).toBe('Beurre AOP');
      expect(ingredient.category).toBe('MATIERES_GRASSES');
      expect(ingredient.price).toBe(8.50);
      expect(ingredient.priceUnit).toBe('KG');
      expect(ingredient.supplier).toBe('Laiterie du terroir');
      expect(ingredient.lotNumber).toBe('LOT-2025-001');
      expect(ingredient.expiryDate).toBeTruthy();
      expect(ingredient.calories).toBe(750);
      expect(ingredient.proteins).toBe(0.5);
      expect(ingredient.allergens).toEqual(['lait']);
    });

    it('should sort by name ascending', async () => {
      await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Vanille Madagascar',
          category: 'EPICES',
          price: 45.00,
          priceUnit: 'KG',
        },
      });

      await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Amandes',
          category: 'FRUITS_SECS',
          price: 18.00,
          priceUnit: 'KG',
        },
      });

      await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Miel d\'acacia',
          category: 'SUCRES',
          price: 12.00,
          priceUnit: 'KG',
        },
      });

      const res = await request(app)
        .get('/ingredients/custom')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].name).toBe('Amandes');
      expect(res.body[1].name).toBe('Miel d\'acacia');
      expect(res.body[2].name).toBe('Vanille Madagascar');
    });
  });

  describe('Edge cases', () => {
    it('should handle ingredients without optional fields', async () => {
      await prisma.customIngredient.create({
        data: {
          userId: userId1,
          name: 'Ingrédient minimal',
          category: 'AUTRE',
          price: 1.00,
          priceUnit: 'KG',
        },
      });

      const res = await request(app)
        .get('/ingredients/custom')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].supplier).toBeNull();
      expect(res.body[0].lotNumber).toBeNull();
      expect(res.body[0].expiryDate).toBeNull();
    });
  });
});
