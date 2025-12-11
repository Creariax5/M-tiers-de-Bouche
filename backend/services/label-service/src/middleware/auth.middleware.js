import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export const authenticateToken = (req, res, next) => {
  // console.log(`🔐 [AUTH] ${req.method} ${req.path}`);
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromQuery = req.query.token;
  const token = tokenFromHeader || tokenFromQuery;
  
  if (!token) {
    // console.log('🔐 [AUTH] ❌ Token manquant');
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log('🔐 [AUTH] ✅ Token valide, userId:', decoded.userId);
    req.user = decoded;
    next();
  } catch (error) {
    // console.log('🔐 [AUTH] ❌ Token invalide:', error.message);
    return res.status(403).json({ error: 'Token invalide' });
  }
};
