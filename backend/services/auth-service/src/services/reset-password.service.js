import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export const createResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  const resetToken = await prisma.resetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return resetToken.token;
};

export const findValidResetToken = async (token) => {
  const resetToken = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return { valid: false, error: 'Token invalide ou expiré' };
  }

  if (resetToken.usedAt) {
    return { valid: false, error: 'Ce token a déjà été utilisé' };
  }

  if (resetToken.expiresAt < new Date()) {
    return { valid: false, error: 'Ce token a expiré' };
  }

  return { valid: true, resetToken };
};

export const resetUserPassword = async (token, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Mettre à jour le mot de passe et marquer le token comme utilisé
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: token.userId },
      data: { password: hashedPassword },
    }),
    prisma.resetToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return updatedUser;
};
