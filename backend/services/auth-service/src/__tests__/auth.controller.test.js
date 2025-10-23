import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import * as authService from '../services/auth.service.js';

jest.mock('../services/auth.service.js');

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        plan: 'trial',
        trialEndsAt: new Date(),
        createdAt: new Date(),
      };

      authService.findUserByEmail.mockResolvedValue(null);
      authService.createUser.mockResolvedValue(mockUser);
      authService.generateToken.mockReturnValue('fake-jwt-token');

      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if email already exists', async () => {
      authService.findUserByEmail.mockResolvedValue({ id: '123', email: 'test@example.com' });

      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cet email est déjà utilisé');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Données invalides');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'short',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Données invalides');
      expect(response.body.details).toBeDefined();
    });
  });

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashed-password',
        plan: 'trial',
      };

      authService.findUserByEmail.mockResolvedValue(mockUser);
      authService.verifyPassword.mockResolvedValue(true);
      authService.generateToken.mockReturnValue('fake-jwt-token');

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 if user does not exist', async () => {
      authService.findUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou mot de passe incorrect');
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashed-password',
      };

      authService.findUserByEmail.mockResolvedValue(mockUser);
      authService.verifyPassword.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou mot de passe incorrect');
    });
  });
});
