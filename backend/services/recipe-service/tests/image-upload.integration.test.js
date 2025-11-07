import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/index.js';
import prisma from '../src/lib/prisma.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

describe('Image Upload Integration Tests', () => {
  let userId;
  let token;
  let recipeId;

  // Créer un fichier PNG de test (1x1 pixel rouge)
  const createTestImage = (filename, size = 'small') => {
    const testDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const filePath = path.join(testDir, filename);

    if (size === 'small') {
      // PNG 1x1 rouge valide (67 bytes)
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
        0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00,
        0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      fs.writeFileSync(filePath, pngBuffer);
    } else if (size === 'large') {
      // Créer un fichier > 5MB (simulé avec des données)
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 0xFF); // 6MB
      fs.writeFileSync(filePath, largeBuffer);
    }

    return filePath;
  };

  // Nettoyer les fichiers de test
  const cleanupTestFiles = () => {
    const testDir = path.join(__dirname, 'fixtures');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  };

  beforeAll(async () => {
    // Utiliser un userId de test (recipe-service n'a pas de table User)
    userId = 'test-user-image-upload';
    token = jwt.sign({ userId, email: 'imagetest@example.com', plan: 'free' }, JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    // Nettoyer
    await prisma.recipeIngredient.deleteMany({ where: { recipe: { userId } } });
    await prisma.recipe.deleteMany({ where: { userId } });
    await prisma.$disconnect();
    cleanupTestFiles();
  });

  beforeEach(async () => {
    // Créer une recette de test
    const recipe = await prisma.recipe.create({
      data: {
        userId,
        name: 'Test Recipe for Image',
        description: 'Recipe to test image upload',
        category: 'dessert',
        servings: 4,
      },
    });
    recipeId = recipe.id;
  });

  afterEach(async () => {
    // Nettoyer les recettes après chaque test
    await prisma.recipe.deleteMany({ where: { userId } });
  });

  // TEST 1: Upload image JPG réussi
  it('should upload JPG image successfully', async () => {
    const imagePath = createTestImage('test.jpg', 'small');

    const res = await request(app)
      .post(`/${recipeId}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imagePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('imageUrl');
    expect(res.body.imageUrl).toContain('recipes/');

    // Vérifier que l'URL est stockée dans la DB
    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    expect(updatedRecipe.imageUrl).toBe(res.body.imageUrl);
  });

  // TEST 2: Upload image PNG réussi
  it('should upload PNG image successfully', async () => {
    const imagePath = createTestImage('test.png', 'small');

    const res = await request(app)
      .post(`/${recipeId}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imagePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('imageUrl');
  });

  // TEST 3: Rejeter fichier > 5MB
  it('should reject file larger than 5MB', async () => {
    const imagePath = createTestImage('large.jpg', 'large');

    const res = await request(app)
      .post(`/${recipeId}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imagePath);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('5MB');
  });

  // TEST 4: Rejeter format non supporté (PDF)
  it('should reject unsupported file format', async () => {
    const testDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    const pdfPath = path.join(testDir, 'test.pdf');
    fs.writeFileSync(pdfPath, 'fake pdf content');

    const res = await request(app)
      .post(`/${recipeId}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', pdfPath);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/format|type/i);
  });

  // TEST 5: Rejeter si aucun fichier
  it('should reject if no file provided', async () => {
    const res = await request(app)
      .post(`/${recipeId}/image`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/file|image/i);
  });

  // TEST 6: Authentification requise
  it('should require authentication', async () => {
    const imagePath = createTestImage('test.jpg', 'small');

    const res = await request(app)
      .post(`/${recipeId}/image`)
      .attach('image', imagePath);

    expect(res.status).toBe(401);
  });

  // TEST 7: Ownership requis (recette d'un autre utilisateur)
  it('should reject if recipe belongs to another user', async () => {
    // Créer une recette pour un autre utilisateur
    const otherUserId = 'other-user-id';
    const otherRecipe = await prisma.recipe.create({
      data: {
        userId: otherUserId,
        name: 'Other Recipe',
        description: 'Another recipe',
        category: 'dessert',
        servings: 4,
      },
    });

    const imagePath = createTestImage('test.jpg', 'small');

    const res = await request(app)
      .post(`/${otherRecipe.id}/image`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imagePath);

    expect(res.status).toBe(404);

    // Cleanup
    await prisma.recipe.delete({ where: { id: otherRecipe.id } });
  });
});

