import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, verifyPassword, generateToken } from '../services/auth.service.js';
import prisma from '../lib/prisma.js';

jest.mock('../lib/prisma.js', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should hash password and create user with trial', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        plan: 'trial',
        trialEndsAt: expect.any(Date),
        createdAt: expect.any(Date),
      };

      bcrypt.hash.mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          password: 'hashed-password',
          plan: 'trial',
        }),
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should set trial to end in 14 days', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      bcrypt.hash.mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        plan: 'trial',
        trialEndsAt: new Date(),
      });

      await createUser(userData);

      const createCall = prisma.user.create.mock.calls[0][0];
      const trialEndsAt = createCall.data.trialEndsAt;
      const now = new Date();
      const diffDays = Math.floor((trialEndsAt - now) / (1000 * 60 * 60 * 24));

      expect(diffDays).toBe(14);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const result = await verifyPassword('password123', 'hashed-password');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const result = await verifyPassword('wrongpassword', 'hashed-password');

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate JWT with correct payload', () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        plan: 'trial',
      };

      process.env.JWT_SECRET = 'test-secret';
      process.env.JWT_EXPIRES_IN = '7d';

      jwt.sign.mockReturnValue('fake-jwt-token');

      const result = generateToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: '123',
          email: 'test@example.com',
          plan: 'trial',
        },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(result).toBe('fake-jwt-token');
    });
  });
});
