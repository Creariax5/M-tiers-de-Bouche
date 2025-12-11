import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';

const generateToken = (userId = 'test-user-id') => {
  return jwt.sign(
    { userId, email: 'test@example.com' },
    process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    { expiresIn: '1h' }
  );
};

describe('Label Service Integration Tests', () => {
  describe('POST /labels/generate', () => {
    it('should generate a PDF label', async () => {
      const token = generateToken();
      const labelData = {
        productName: 'Tarte au Citron',
        ingredients: [
          { name: 'Farine', quantity: 200, unit: 'g' },
          { name: 'Sucre', quantity: 100, unit: 'g' },
          { name: 'Oeufs', quantity: 3, unit: 'pièce' }
        ],
        nutrition: {
          energy: 250,
          fat: 10,
          saturatedFat: 5,
          carbs: 30,
          sugars: 15,
          proteins: 5,
          salt: 0.5
        },
        allergens: ['gluten', 'oeufs']
      };

      const res = await request(app)
        .post('/labels/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(labelData);

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toBe('application/pdf');
      expect(res.body).toBeTruthy(); // Should be a buffer
    });

    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .post('/labels/generate')
        .send({});
      
      expect(res.status).toBe(401);
    });
  });
});
