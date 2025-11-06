import { vi } from 'vitest';

// Mock du module api
export const createMockApi = () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  };
  
  return mockApi;
};

// Helper pour créer un utilisateur de test
export const createTestUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  company: 'Test Company',
  ...overrides,
});

// Helper pour créer un token JWT de test
export const createTestToken = () => 'test-jwt-token-12345';
