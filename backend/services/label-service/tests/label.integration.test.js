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
  // Test de génération de PDF avec données complètes
  describe('POST /labels/generate', () => {
    it('should generate a PDF label', async () => {
      const token = generateToken();
      const labelData = {
        productName: 'Tarte au Citron',
        ingredients: [
          { name: 'Farine', quantity: 200, unit: 'g', allergens: ['gluten'] },
          { name: 'Sucre', quantity: 100, unit: 'g', allergens: [] },
          { name: 'Oeufs', quantity: 3, unit: 'pièce', isAllergen: true }
        ],
        nutrition: {
          energy: 1045,
          energyKcal: 250,
          fat: 10,
          saturatedFat: 5,
          carbs: 30,
          sugars: 15,
          proteins: 5,
          salt: 0.5
        },
        mentions: {
          netWeight: '350g',
          dlc: '15/12/2025',
          storage: 'Au frais',
          manufacturer: 'Ma Boulangerie'
        }
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

    it('should support different templates', async () => {
      const token = generateToken();
      const templates = ['classic', 'modern', 'minimalist'];
      
      for (const template of templates) {
        const res = await request(app)
          .post('/labels/generate')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            productName: `Test ${template}`,
            template: template 
          });
          
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toBe('application/pdf');
      }
    });
  });

  describe('GET /labels', () => {
    it('should return label history for user', async () => {
      const token = generateToken();
      
      // D'abord générer un label
      await request(app)
        .post('/labels/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ productName: 'Test History' });
        
      // Ensuite récupérer l'historique
      const res = await request(app)
        .get('/labels')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].productName).toBe('Test History');
      expect(res.body[0].url).toBeDefined();
    });
  });
});
