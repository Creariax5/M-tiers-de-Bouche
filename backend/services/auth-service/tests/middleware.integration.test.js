import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import app from '../src/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

describe('JWT Middleware Integration Tests', () => {
  let validToken;
  let expiredToken;
  let testUser;

  beforeAll(async () => {
    // Créer un utilisateur de test en BDD
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'jwt-middleware-test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        company: 'Test Company',
        plan: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });
    
    // Générer un token valide avec le vrai user ID
    validToken = jwt.sign({ 
      userId: testUser.id, 
      email: testUser.email, 
      plan: testUser.plan 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    // Générer un token expiré
    expiredToken = jwt.sign({ 
      userId: testUser.id, 
      email: testUser.email, 
      plan: testUser.plan 
    }, JWT_SECRET, { expiresIn: '-1s' });
  });
  
  afterAll(async () => {
    // Nettoyer l'utilisateur de test
    await prisma.user.delete({
      where: { email: 'jwt-middleware-test@example.com' }
    }).catch(() => {}); // Ignore si déjà supprimé
    await prisma.$disconnect();
  });

  describe('GET /me - Protected Route', () => {
    test('should return 401 when no token provided', async () => {
      const res = await request(app).get('/me');
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token manquant');
    });

    test('should return 403 when token is invalid', async () => {
      const res = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer invalid-token-123');
      
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Token invalide');
    });

    test('should return 403 when token is expired', async () => {
      const res = await request(app)
        .get('/me')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Token invalide');
    });

    test('should return 200 and user data when token is valid', async () => {
      const res = await request(app)
        .get('/me')
        .set('Authorization', `Bearer ${validToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.userId).toBe(testUser.id);
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.password).toBeUndefined(); // Le mot de passe ne doit pas être retourné
    });

    test('should accept token from query parameter', async () => {
      const res = await request(app)
        .get(`/me?token=${validToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
    });
  });
});
