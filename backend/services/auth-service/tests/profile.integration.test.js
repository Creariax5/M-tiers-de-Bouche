import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Profile Integration Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Nettoyer d'abord les utilisateurs de test précédents
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'profile-test@example.com',
            'other-user@example.com',
            'delete-test@example.com',
            'cascade-test@example.com'
          ]
        }
      }
    });

    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'profile-test@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        company: 'Test Company',
        plan: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    // Générer un token pour les requêtes authentifiées
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: 'profile-test@example.com',
        password: 'TestPass123!'
      });
    
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    // Nettoyer tous les utilisateurs de test
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            'profile-test@example.com',
            'other-user@example.com',
            'delete-test@example.com',
            'cascade-test@example.com'
          ]
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('PUT /me - Update Profile', () => {
    test('should update user profile with valid data', async () => {
      const updates = {
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'New Company'
      };

      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.firstName).toBe('Jane');
      expect(res.body.user.lastName).toBe('Smith');
      expect(res.body.user.company).toBe('New Company');
      expect(res.body.user.password).toBeUndefined();
    });

    test('should update only provided fields', async () => {
      const updates = {
        firstName: 'UpdatedName'
      };

      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.user.firstName).toBe('UpdatedName');
      // Les autres champs doivent rester inchangés
      expect(res.body.user.company).toBe('New Company'); // Du test précédent
    });

    test('should return 401 when no token provided', async () => {
      const res = await request(app)
        .put('/me')
        .send({ firstName: 'Test' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'invalid-email' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test('should return 400 when trying to update email to existing one', async () => {
      // Créer un deuxième utilisateur
      const hashedPassword = await bcrypt.hash('TestPass123!', 10);
      const otherUser = await prisma.user.create({
        data: {
          email: 'other-user@example.com',
          password: hashedPassword,
          firstName: 'Other',
          lastName: 'User',
          company: 'Other Company',
          plan: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      });

      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'other-user@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('existe déjà');

      // Nettoyer
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    test('should not allow updating plan field', async () => {
      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ plan: 'premium' });

      expect(res.status).toBe(200);
      // Le plan ne devrait pas changer (toujours 'trial')
      expect(res.body.user.plan).toBe('trial');
    });

    test('should not allow updating password directly', async () => {
      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'NewPassword123!' });

      expect(res.status).toBe(200);
      
      // Vérifier que le mot de passe n'a pas changé en essayant de se connecter
      const loginRes = await request(app)
        .post('/login')
        .send({
          email: 'profile-test@example.com',
          password: 'TestPass123!' // Ancien mot de passe
        });

      expect(loginRes.status).toBe(200);
    });

    test('should handle empty update gracefully', async () => {
      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
    });

    test('should trim whitespace from string fields', async () => {
      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: '  Trimmed  ',
          lastName: '  Name  '
        });

      expect(res.status).toBe(200);
      expect(res.body.user.firstName).toBe('Trimmed');
      expect(res.body.user.lastName).toBe('Name');
    });

    test('should return 400 for fields with invalid types', async () => {
      const res = await request(app)
        .put('/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 12345 // Nombre au lieu de string
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('DELETE /me - Delete Account', () => {
    test('should delete user account when authenticated', async () => {
      // Créer un utilisateur spécifique pour ce test
      const hashedPassword = await bcrypt.hash('DeletePass123!', 10);
      const userToDelete = await prisma.user.create({
        data: {
          email: 'delete-test@example.com',
          password: hashedPassword,
          firstName: 'Delete',
          lastName: 'Test',
          company: 'Delete Company',
          plan: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      });

      const loginRes = await request(app)
        .post('/login')
        .send({
          email: 'delete-test@example.com',
          password: 'DeletePass123!'
        });

      const deleteToken = loginRes.body.token;

      const res = await request(app)
        .delete('/me')
        .set('Authorization', `Bearer ${deleteToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('supprimé');

      // Vérifier que l'utilisateur n'existe plus
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id }
      });
      expect(deletedUser).toBeNull();
    });

    test('should return 401 when no token provided', async () => {
      const res = await request(app).delete('/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test('should cascade delete related data', async () => {
      // Créer un utilisateur avec un reset token
      const hashedPassword = await bcrypt.hash('CascadePass123!', 10);
      const userWithData = await prisma.user.create({
        data: {
          email: 'cascade-test@example.com',
          password: hashedPassword,
          firstName: 'Cascade',
          lastName: 'Test',
          company: 'Cascade Company',
          plan: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      });

      // Créer un reset token pour cet utilisateur
      await prisma.resetToken.create({
        data: {
          token: 'test-token-cascade',
          userId: userWithData.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
      });

      const loginRes = await request(app)
        .post('/login')
        .send({
          email: 'cascade-test@example.com',
          password: 'CascadePass123!'
        });

      const cascadeToken = loginRes.body.token;

      const res = await request(app)
        .delete('/me')
        .set('Authorization', `Bearer ${cascadeToken}`);

      expect(res.status).toBe(200);

      // Vérifier que les reset tokens ont été supprimés aussi
      const resetTokens = await prisma.resetToken.findMany({
        where: { userId: userWithData.id }
      });
      expect(resetTokens.length).toBe(0);
    });
  });
});
