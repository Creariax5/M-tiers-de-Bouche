import { forgotPasswordSchema, resetPasswordSchema } from '../validators/reset-password.validator.js';
import { createResetToken, findValidResetToken, resetUserPassword } from '../services/reset-password.service.js';
import { findUserByEmail } from '../services/auth.service.js';

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 heure

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Nettoyer les anciennes requêtes
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
};

export const forgotPassword = async (req, res) => {
  try {
    // Rate limiting
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: 'Trop de tentatives. Veuillez réessayer plus tard.' 
      });
    }

    // Validation
    const validation = forgotPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        errors: validation.error.flatten().fieldErrors 
      });
    }

    const { email } = validation.data;

    // Chercher l'utilisateur
    const user = await findUserByEmail(email);

    // Pour la sécurité, toujours retourner 200 même si l'email n'existe pas
    if (!user) {
      return res.json({ 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' 
      });
    }

    // Créer le token de reset
    const token = await createResetToken(user.id);

    // TODO: Envoyer l'email avec le token
    // Pour l'instant, on log juste le token (DÉVELOPPEMENT UNIQUEMENT)
    console.log(`🔑 Reset token pour ${email}: ${token}`);

    res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Validation
    const validation = resetPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        errors: validation.error.flatten().fieldErrors 
      });
    }

    const { token, password } = validation.data;

    // Vérifier la validité du token
    const tokenResult = await findValidResetToken(token);
    if (!tokenResult.valid) {
      return res.status(400).json({ error: tokenResult.error });
    }

    // Réinitialiser le mot de passe
    await resetUserPassword(tokenResult.resetToken, password);

    res.json({ 
      message: 'Votre mot de passe a été réinitialisé avec succès.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};
