import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import app from '../src/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Password Reset Integration Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash('OldPass123!', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'reset-test@example.com',
        password: hashedPassword,
        firstName: 'Reset',
        lastName: 'Test',
        company: 'Test Company',
        plan: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });
  });

  afterAll(async () => {
    // Nettoyer les tokens de reset
    await prisma.resetToken.deleteMany({
      where: { userId: testUser.id }
    });
    // Nettoyer l'utilisateur
    await prisma.user.delete({
      where: { email: 'reset-test@example.com' }
    }).catch(() => {});
    await prisma.$disconnect();
  });

  describe('POST /forgot-password', () => {
    test('should return 200 and create reset token for valid email', async () => {
      const res = await request(app)
        .post('/forgot-password')
        .send({ email: 'reset-test@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
      expect(res.body.message).toContain('envoyé');

      // Vérifier qu'un token a été créé en BDD
      const tokens = await prisma.resetToken.findMany({
        where: { userId: testUser.id }
      });
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0].token).toBeDefined();
      expect(tokens[0].expiresAt).toBeDefined();
      expect(tokens[0].usedAt).toBeNull();
    });

    test('should return 200 even for non-existent email (security)', async () => {
      const res = await request(app)
        .post('/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      // Ne pas révéler que l'email n'existe pas
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('envoyé');
    });

    test('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/forgot-password')
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test('should rate limit after 3 requests', async () => {
      // Faire 3 requêtes successives
      await request(app).post('/forgot-password').send({ email: 'test1@example.com' });
      await request(app).post('/forgot-password').send({ email: 'test2@example.com' });
      await request(app).post('/forgot-password').send({ email: 'test3@example.com' });

      // La 4ème doit être bloquée
      const res = await request(app)
        .post('/forgot-password')
        .send({ email: 'test4@example.com' });

      expect(res.status).toBe(429);
      expect(res.body.error).toContain('Trop de tentatives');
    });
  });

  describe('POST /reset-password', () => {
    let validToken;

    beforeAll(async () => {
      // Créer un token valide pour les tests
      const tokenString = crypto.randomBytes(32).toString('hex');
      const resetToken = await prisma.resetToken.create({
        data: {
          token: tokenString,
          userId: testUser.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
        }
      });
      validToken = resetToken.token;
    });

    test('should reset password with valid token', async () => {
      const newPassword = 'NewPass123!';
      const res = await request(app)
        .post('/reset-password')
        .send({ 
          token: validToken, 
          password: newPassword,
          confirmPassword: newPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('réinitialisé');

      // Vérifier que le mot de passe a changé
      const user = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      const passwordMatch = await bcrypt.compare(newPassword, user.password);
      expect(passwordMatch).toBe(true);

      // Vérifier que le token est marqué comme utilisé
      const token = await prisma.resetToken.findUnique({
        where: { token: validToken }
      });
      expect(token.usedAt).not.toBeNull();
    });

    test('should return 400 for invalid token', async () => {
      const res = await request(app)
        .post('/reset-password')
        .send({ 
          token: 'invalid-token-123', 
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('invalide');
    });

    test('should return 400 for expired token', async () => {
      // Créer un token expiré
      const expiredTokenString = crypto.randomBytes(32).toString('hex');
      await prisma.resetToken.create({
        data: {
          token: expiredTokenString,
          userId: testUser.id,
          expiresAt: new Date(Date.now() - 60 * 60 * 1000), // Expiré depuis 1h
        }
      });

      const res = await request(app)
        .post('/reset-password')
        .send({ 
          token: expiredTokenString, 
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('expiré');
    });

    test('should return 400 for already used token', async () => {
      // Créer un token déjà utilisé
      const usedTokenString = crypto.randomBytes(32).toString('hex');
      await prisma.resetToken.create({
        data: {
          token: usedTokenString,
          userId: testUser.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          usedAt: new Date(), // Déjà utilisé
        }
      });

      const res = await request(app)
        .post('/reset-password')
        .send({ 
          token: usedTokenString, 
          password: 'NewPass123!',
          confirmPassword: 'NewPass123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Ce token a déjà été utilisé');
    });

    test('should return 400 when passwords do not match', async () => {
      const newTokenString = crypto.randomBytes(32).toString('hex');
      await prisma.resetToken.create({
        data: {
          token: newTokenString,
          userId: testUser.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        }
      });

      const res = await request(app)
        .post('/reset-password')
        .send({ 
          token: newTokenString, 
          password: 'NewPass123!',
          confirmPassword: 'DifferentPass123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test('should return 400 for weak password', async () => {
      const weakTokenString = crypto.randomBytes(32).toString('hex');
      await prisma.resetToken.create({
        data: {
          token: weakTokenString,
          userId: testUser.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        }
      });

      const res = await request(app)
        .post('/reset-password')
        .send({ 
          token: weakTokenString, 
          password: '123',
          confirmPassword: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
});
