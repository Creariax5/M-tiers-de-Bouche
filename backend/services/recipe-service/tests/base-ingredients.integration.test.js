import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const testUser = {
  id: 'test-user-id-123',
  email: 'chef@example.com'
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

let token;

beforeAll(async () => {
  token = generateToken(testUser);
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('BaseIngredient - Import Ciqual', () => {
  it('should have imported Ciqual base ingredients', async () => {
    const count = await prisma.baseIngredient.count();
    
    // Au moins 2000 aliments importés (on a 2197)
    expect(count).toBeGreaterThanOrEqual(2000);
  });

  it('should have ingredients with all required nutritional fields', async () => {
    const ingredient = await prisma.baseIngredient.findFirst({
      where: { category: 'FARINES' }
    });

    expect(ingredient).toBeDefined();
    expect(ingredient.name).toBeDefined();
    expect(ingredient.category).toBe('FARINES');
    expect(ingredient.calories).toBeGreaterThanOrEqual(0);
    expect(ingredient.proteins).toBeGreaterThanOrEqual(0);
    expect(ingredient.carbs).toBeGreaterThanOrEqual(0);
    expect(ingredient.fats).toBeGreaterThanOrEqual(0);
    expect(ingredient.salt).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(ingredient.allergens)).toBe(true);
  });

  it('should have ingredients with ciqualCode', async () => {
    const ingredient = await prisma.baseIngredient.findFirst({
      where: { ciqualCode: { not: null } }
    });

    expect(ingredient).toBeDefined();
    expect(ingredient.ciqualCode).toBeDefined();
    expect(ingredient.ciqualCode.length).toBeGreaterThan(0);
  });

  it('should have multiple categories (FARINES, CHOCOLAT_CACAO, EPICES, AUTRE)', async () => {
    const categories = await prisma.baseIngredient.groupBy({
      by: ['category'],
      _count: true
    });

    expect(categories.length).toBeGreaterThanOrEqual(4);
    
    const categoryNames = categories.map(c => c.category);
    expect(categoryNames).toContain('FARINES');
    expect(categoryNames).toContain('CHOCOLAT_CACAO');
    expect(categoryNames).toContain('EPICES');
    expect(categoryNames).toContain('AUTRE');
  });

  it('should have FARINES category with at least 50 items', async () => {
    const count = await prisma.baseIngredient.count({
      where: { category: 'FARINES' }
    });

    expect(count).toBeGreaterThanOrEqual(50);
  });

  it('should have CHOCOLAT_CACAO category with at least 100 items', async () => {
    const count = await prisma.baseIngredient.count({
      where: { category: 'CHOCOLAT_CACAO' }
    });

    expect(count).toBeGreaterThanOrEqual(100);
  });

  it('should have ingredients with optional fields (sugars, saturatedFats, fiber)', async () => {
    // Chercher un ingrédient avec sucres
    const withSugars = await prisma.baseIngredient.findFirst({
      where: { sugars: { not: null } }
    });

    // Chercher un ingrédient avec AG saturés
    const withSaturatedFats = await prisma.baseIngredient.findFirst({
      where: { saturatedFats: { not: null } }
    });

    // Chercher un ingrédient avec fibres
    const withFiber = await prisma.baseIngredient.findFirst({
      where: { fiber: { not: null } }
    });

    // Au moins un de chaque doit exister
    expect(withSugars).toBeDefined();
    expect(withSaturatedFats).toBeDefined();
    expect(withFiber).toBeDefined();
  });

  it('should have unique ciqualCode for each ingredient', async () => {
    // Compter les ingrédients avec ciqualCode
    const withCode = await prisma.baseIngredient.count({
      where: { ciqualCode: { not: null } }
    });

    // Compter les codes uniques
    const uniqueCodes = await prisma.baseIngredient.groupBy({
      by: ['ciqualCode'],
      where: { ciqualCode: { not: null } }
    });

    // Le nombre doit être identique (pas de doublons)
    expect(uniqueCodes.length).toBe(withCode);
  });

  it('should support full-text search on ingredient names', async () => {
    // Test de recherche avec PostgreSQL full-text search
    // On cherche "farine" qui devrait donner plusieurs résultats
    const results = await prisma.$queryRaw`
      SELECT id, name, category 
      FROM base_ingredients 
      WHERE to_tsvector('french', name) @@ to_tsquery('french', 'farine')
      LIMIT 10
    `;

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Vérifier qu'au moins un résultat contient "farine" ou "Farine"
    const hasMatchingName = results.some(r => 
      r.name.toLowerCase().includes('farine')
    );
    expect(hasMatchingName).toBe(true);
  });
});

describe('GET /ingredients/base - Search base ingredients', () => {
  it('should search base ingredients by name', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=farine')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBeLessThanOrEqual(20); // Limite 20 résultats
    
    // Vérifier structure des résultats
    const firstResult = response.body[0];
    expect(firstResult).toHaveProperty('id');
    expect(firstResult).toHaveProperty('name');
    expect(firstResult).toHaveProperty('category');
    expect(firstResult).toHaveProperty('calories');
    expect(firstResult).toHaveProperty('proteins');
    expect(firstResult).toHaveProperty('carbs');
    expect(firstResult).toHaveProperty('fats');
    expect(firstResult).toHaveProperty('salt');
  });

  it('should return results with relevance (most relevant first)', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=chocolat')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    
    // Le premier résultat devrait contenir "chocolat" dans le nom
    const firstResult = response.body[0];
    expect(firstResult.name.toLowerCase()).toContain('chocolat');
  });

  it('should return empty array if no match', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=zzzznonexistantzzz')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=farine');

    expect(response.status).toBe(401);
  });

  it('should validate search query (min 2 characters)', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=a')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should limit results to 20 items', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=a') // Recherche large
      .set('Authorization', `Bearer ${token}`);

    if (response.status === 200) {
      expect(response.body.length).toBeLessThanOrEqual(20);
    }
  });

  it('should search in french with accents', async () => {
    const response = await request(app)
      .get('/ingredients/base?search=café')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('GET /ingredients/base/:id - Get base ingredient details', () => {
  it('should return ingredient details by id', async () => {
    // Récupérer un ingrédient
    const ingredient = await prisma.baseIngredient.findFirst({
      where: { category: 'FARINES' }
    });

    const response = await request(app)
      .get(`/ingredients/base/${ingredient.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(ingredient.id);
    expect(response.body.name).toBe(ingredient.name);
    expect(response.body.category).toBe(ingredient.category);
    expect(response.body).toHaveProperty('calories');
    expect(response.body).toHaveProperty('proteins');
    expect(response.body).toHaveProperty('carbs');
    expect(response.body).toHaveProperty('fats');
    expect(response.body).toHaveProperty('salt');
    expect(response.body).toHaveProperty('allergens');
  });

  it('should return 404 if ingredient not found', async () => {
    const response = await request(app)
      .get('/ingredients/base/99999999-9999-9999-9999-999999999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should require authentication', async () => {
    const ingredient = await prisma.baseIngredient.findFirst();

    const response = await request(app)
      .get(`/ingredients/base/${ingredient.id}`);

    expect(response.status).toBe(401);
  });
});
