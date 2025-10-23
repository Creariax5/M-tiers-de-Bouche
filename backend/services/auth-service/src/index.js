import express from 'express';
import { register, login } from './controllers/auth.controller.js';
import { getMe } from './controllers/user.controller.js';
import { authenticateToken } from './middleware/auth.middleware.js';
import { forgotPassword, resetPassword } from './controllers/reset-password.controller.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.post('/register', register);
app.post('/login', login);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);
app.get('/me', authenticateToken, getMe);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Auth Service running on port ${PORT}`);
  });
}

export default app;
