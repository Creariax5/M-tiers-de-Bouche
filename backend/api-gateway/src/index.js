const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Sentry = require('@sentry/node');

const app = express();
const PORT = process.env.PORT || 3000;

// Sentry initialization
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  console.log('✅ Sentry monitoring enabled');
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:80',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Proxy routes
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/recipes', createProxyMiddleware({
  target: process.env.RECIPE_SERVICE_URL || 'http://recipe-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/recipes': '' }
}));

app.use('/api/labels', createProxyMiddleware({
  target: process.env.LABEL_SERVICE_URL || 'http://label-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/labels': '' }
}));

app.use('/api/production', createProxyMiddleware({
  target: process.env.PRODUCTION_SERVICE_URL || 'http://production-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/production': '' }
}));

// Sentry error handler (must be before custom error handler)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(err.status || 500).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying routes:`);
  console.log(`   - /api/auth       → ${process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'}`);
  console.log(`   - /api/recipes    → ${process.env.RECIPE_SERVICE_URL || 'http://recipe-service:3002'}`);
  console.log(`   - /api/labels     → ${process.env.LABEL_SERVICE_URL || 'http://label-service:3003'}`);
  console.log(`   - /api/production → ${process.env.PRODUCTION_SERVICE_URL || 'http://production-service:3004'}`);
});
