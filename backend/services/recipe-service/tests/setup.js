// Configuration Jest - exécuté avant tous les tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/saas_recipes?schema=public';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
