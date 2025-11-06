import { describe, test, expect } from '@jest/globals';
import { registerSchema, loginSchema } from '../src/validators/auth.validator.js';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    test('valide un utilisateur correct', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Jean',
        lastName: 'Dupont',
        company: 'Boulangerie',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('rejette un email invalide', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path[0]).toBe('email');
    });

    test('rejette un mot de passe trop court', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '1234567',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path[0]).toBe('password');
    });

    test('accepte les champs optionnels vides', () => {
      const minimalData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = registerSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    test('valide des credentials corrects', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('rejette un email invalide', () => {
      const invalidData = {
        email: 'invalid',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('rejette un mot de passe vide', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
