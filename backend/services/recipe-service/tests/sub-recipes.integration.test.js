import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';

const testUser = {
  id: 'test-user-subrecipes-123',
  email: 'chef-subrecipes@example.com'
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

afterEach(async () => {
  await prisma.recipeIngredient.deleteMany({});
  await prisma.baseIngredient.deleteMany({});
  await prisma.recipe.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Sub-Recipes (Compositions)', () => {
  describe('POST /recipes/:id/ingredients avec subRecipeId', () => {
    it('should add a sub-recipe as ingredient', async () => {
      // Créer une sous-recette (pâte feuilletée)
      const pateFeuilletee = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Pâte feuilletée',
          category: 'BASE',
          servings: 1
        }
      });

      // Créer ingrédients de la sous-recette
      const beurre = await prisma.baseIngredient.create({
        data: {
          
          name: 'Beurre',
          
          pricePerUnit: 0.01, // 1€/100g
          calories: 750,
          proteins: 0.6,
          carbs: 0.1,
          sugars: 0.1,
          fats: 82,
          saturatedFats: 51,
          salt: 0.8,
          allergens: 'lait'
        }
      });

      const farine = await prisma.baseIngredient.create({
        data: {
          
          name: 'Farine',
          
          pricePerUnit: 0.002, // 0.2€/100g
          calories: 350,
          proteins: 10.5,
          carbs: 72.0,
          sugars: 2.0,
          fats: 1.2,
          saturatedFats: 0.3,
          salt: 0.01,
          allergens: 'gluten'
        }
      });

      // Ajouter ingrédients à la sous-recette
      await prisma.recipeIngredient.createMany({
        data: [
          { recipeId: pateFeuilletee.id, ingredientId: beurre.id, quantity: 250, unit: 'g' },
          { recipeId: pateFeuilletee.id, ingredientId: farine.id, quantity: 500, unit: 'g' }
        ]
      });

      // Créer recette principale (croissant)
      const croissant = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Croissant',
          category: 'VIENNOISERIE',
          servings: 10
        }
      });

      // Ajouter sous-recette comme ingrédient
      const response = await request(app)
        .post(`/${croissant.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: pateFeuilletee.id, // 🆕 Sous-recette au lieu d'ingrédient
          quantity: 750,
          
          lossPercent: 0
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.subRecipeId).toBe(pateFeuilletee.id);
      expect(response.body.ingredientId).toBeNull(); // Exclusif
      expect(response.body.quantity).toBe(750);
    });

    it('should reject if both ingredientId and subRecipeId provided', async () => {
      const recipe = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Test Recipe',
          servings: 1
        }
      });

      const ingredient = await prisma.baseIngredient.create({
        data: {
          
          name: 'Test Ingredient',
          unit: 'g'
        }
      });

      const subRecipe = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Sub Recipe',
          servings: 1
        }
      });

      const response = await request(app)
        .post(`/${recipe.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ingredientId: ingredient.id,
          subRecipeId: subRecipe.id, // ❌ Pas les deux en même temps
          quantity: 100,
          unit: 'g'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('soit ingredientId soit subRecipeId');
    });

    it('should reject if neither ingredientId nor subRecipeId provided', async () => {
      const recipe = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Test Recipe',
          servings: 1
        }
      });

      const response = await request(app)
        .post(`/${recipe.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 100,
          unit: 'g'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('soit ingredientId soit subRecipeId');
    });
  });

  describe('Calculs en cascade (récursifs)', () => {
    it('should calculate allergens from sub-recipes recursively', async () => {
      // Niveau 3 : Ingrédient de base (beurre avec lait)
      const beurre = await prisma.baseIngredient.create({
        data: {
          
          name: 'Beurre',
          
          allergens: 'lait'
        }
      });

      // Niveau 2 : Sous-recette (pâte avec gluten)
      const pate = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Pâte',
          servings: 1
        }
      });

      const farine = await prisma.baseIngredient.create({
        data: {
          
          name: 'Farine',
          
          allergens: 'gluten'
        }
      });

      await prisma.recipeIngredient.createMany({
        data: [
          { recipeId: pate.id, ingredientId: beurre.id, quantity: 100, unit: 'g' },
          { recipeId: pate.id, ingredientId: farine.id, quantity: 300, unit: 'g' }
        ]
      });

      // Niveau 1 : Recette principale (croissant avec œufs)
      const croissant = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Croissant',
          servings: 10
        }
      });

      const oeufs = await prisma.baseIngredient.create({
        data: {
          
          name: 'Œufs',
          
          allergens: 'oeufs'
        }
      });

      // Ajouter sous-recette + ingrédient direct
      await request(app)
        .post(`/${croissant.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: pate.id,
          quantity: 400,
          unit: 'g'
        });

      await request(app)
        .post(`/${croissant.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ingredientId: oeufs.id,
          quantity: 2,
          unit: 'pièce'
        });

      // Récupérer allergènes (doit être récursif)
      const response = await request(app)
        .get(`/${croissant.id}/allergens`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.allergens).toHaveLength(3);
      expect(response.body.allergens).toEqual(
        expect.arrayContaining(['gluten', 'lait', 'oeufs'])
      );
    });

    it('should calculate nutrition from sub-recipes recursively', async () => {
      // Sous-recette (pâte : 1000g = 500g farine + 500g eau)
      const pate = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Pâte de base',
          servings: 1
        }
      });

      const farine = await prisma.baseIngredient.create({
        data: {
          
          name: 'Farine',
          
          category: 'AUTRE',
          
          allergens: [],
          
          calories: 350,
          proteins: 10,
          carbs: 70,
          sugars: 2,
          fats: 1,
          saturatedFats: 0.3,
          salt: 0.01
        }
      });

      const eau = await prisma.baseIngredient.create({
        data: {
          
          name: 'Eau',
          
          category: 'AUTRE',
          
          allergens: [],
          
          calories: 0,
          proteins: 0,
          carbs: 0,
          sugars: 0,
          fats: 0,
          saturatedFats: 0,
          salt: 0
        }
      });

      await prisma.recipeIngredient.createMany({
        data: [
          { recipeId: pate.id, ingredientId: farine.id, quantity: 500, unit: 'g' },
          { recipeId: pate.id, ingredientId: eau.id, quantity: 500, unit: 'ml' }
        ]
      });

      // Recette principale (pain : 1000g pâte)
      const pain = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Pain',
          servings: 4
        }
      });

      await request(app)
        .post(`/${pain.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: pate.id,
          quantity: 1000,
          unit: 'g'
        });

      // Calculer nutrition (doit inclure les ingrédients de la sous-recette)
      const response = await request(app)
        .get(`/${pain.id}/nutrition`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const nutrition = response.body.nutrition;

      // Vérifications : 500g farine dans 1000g final = 175 kcal/100g
      expect(nutrition.per100g.energyKcal).toBeCloseTo(175, 0);
      expect(nutrition.per100g.proteins).toBeCloseTo(5, 1);
      expect(nutrition.per100g.carbs).toBeCloseTo(35, 1);
    });

    it('should calculate pricing from sub-recipes recursively', async () => {
      // Sous-recette (pâte : 2.5€ = 250g beurre à 0.01€/g + 500g farine à 0.002€/g)
      const pate = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Pâte feuilletée',
          servings: 1
        }
      });

      const beurre = await prisma.baseIngredient.create({
        data: {
          
          name: 'Beurre',
          
          pricePerUnit: 0.01 // 1€/100g
        }
      });

      const farine = await prisma.baseIngredient.create({
        data: {
          
          name: 'Farine',
          
          pricePerUnit: 0.002 // 0.2€/100g
        }
      });

      await prisma.recipeIngredient.createMany({
        data: [
          { recipeId: pate.id, ingredientId: beurre.id, quantity: 250, unit: 'g' },
          { recipeId: pate.id, ingredientId: farine.id, quantity: 500, unit: 'g' }
        ]
      });

      // Recette principale (croissant : 750g pâte + 50g chocolat)
      const croissant = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Croissant au chocolat',
          servings: 10
        }
      });

      const chocolat = await prisma.baseIngredient.create({
        data: {
          
          name: 'Chocolat',
          
          pricePerUnit: 0.02 // 2€/100g
        }
      });

      await request(app)
        .post(`/${croissant.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: pate.id,
          quantity: 750,
          unit: 'g'
        });

      await request(app)
        .post(`/${croissant.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ingredientId: chocolat.id,
          quantity: 50,
          unit: 'g'
        });

      // Calculer coût (doit inclure le coût de la sous-recette)
      const response = await request(app)
        .get(`/${croissant.id}/pricing`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const pricing = response.body.pricing;

      // Coût attendu :
      // Pâte : (250g × 0.01€ + 500g × 0.002€) = 2.5€ + 1€ = 3.5€ pour 750g
      // Chocolat : 50g × 0.02€ = 1€
      // Total : 3.5€ + 1€ = 4.5€
      expect(pricing.totalCost).toBeCloseTo(4.5, 1);
    });
  });

  describe('Détection de boucles infinies', () => {
    it('should reject circular dependency (A uses B, B uses A)', async () => {
      // Créer recette A
      const recipeA = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe A',
          servings: 1
        }
      });

      // Créer recette B
      const recipeB = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe B',
          servings: 1
        }
      });

      // A utilise B
      await request(app)
        .post(`/${recipeA.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeB.id,
          quantity: 100,
          unit: 'g'
        });

      // B essaie d'utiliser A (boucle)
      const response = await request(app)
        .post(`/${recipeB.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeA.id,
          quantity: 100,
          unit: 'g'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('circulaire');
    });

    it('should reject circular dependency (A → B → C → A)', async () => {
      // Créer 3 recettes
      const recipeA = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe A',
          servings: 1
        }
      });

      const recipeB = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe B',
          servings: 1
        }
      });

      const recipeC = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe C',
          servings: 1
        }
      });

      // A → B
      await request(app)
        .post(`/${recipeA.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeB.id,
          quantity: 100,
          unit: 'g'
        });

      // B → C
      await request(app)
        .post(`/${recipeB.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeC.id,
          quantity: 100,
          unit: 'g'
        });

      // C → A (boucle)
      const response = await request(app)
        .post(`/${recipeC.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeA.id,
          quantity: 100,
          unit: 'g'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('circulaire');
    });

    it('should allow self-contained hierarchies (A → B, C → D no loop)', async () => {
      // Créer 4 recettes
      const recipeA = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe A',
          servings: 1
        }
      });

      const recipeB = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe B',
          servings: 1
        }
      });

      const recipeC = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe C',
          servings: 1
        }
      });

      const recipeD = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Recipe D',
          servings: 1
        }
      });

      // A → B (OK)
      const res1 = await request(app)
        .post(`/${recipeA.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeB.id,
          quantity: 100,
          unit: 'g'
        });
      expect(res1.status).toBe(201);

      // C → D (OK, pas de lien avec A-B)
      const res2 = await request(app)
        .post(`/${recipeC.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: recipeD.id,
          quantity: 100,
          unit: 'g'
        });
      expect(res2.status).toBe(201);
    });
  });

  describe('GET /recipes/:id with sub-recipes', () => {
    it('should include sub-recipes in ingredients list', async () => {
      // Créer sous-recette
      const subRecipe = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Pâte de base',
          servings: 1
        }
      });

      // Créer recette principale
      const mainRecipe = await prisma.recipe.create({
        data: {
          userId: testUser.id,
          name: 'Croissant',
          servings: 10
        }
      });

      // Ajouter sous-recette
      await request(app)
        .post(`/${mainRecipe.id}/ingredients`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          subRecipeId: subRecipe.id,
          quantity: 500,
          unit: 'g'
        });

      // Récupérer recette
      const response = await request(app)
        .get(`/${mainRecipe.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.ingredients).toHaveLength(1);
      expect(response.body.ingredients[0]).toHaveProperty('subRecipe');
      expect(response.body.ingredients[0].subRecipe.name).toBe('Pâte de base');
    });
  });
});

