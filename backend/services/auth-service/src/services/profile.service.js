import prisma from '../lib/prisma.js';

export const updateUserProfile = async (userId, updates) => {
  // Filtrer les champs non modifiables
  const allowedFields = ['email', 'firstName', 'lastName', 'company', 'logoUrl'];
  const filteredUpdates = {};
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      filteredUpdates[key] = value;
    }
  }

  // Vérifier l'unicité de l'email si changé
  if (filteredUpdates.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: filteredUpdates.email }
    });
    
    if (existingUser && existingUser.id !== userId) {
      throw new Error('EMAIL_EXISTS');
    }
  }

  // Mettre à jour l'utilisateur
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: filteredUpdates,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: true,
      logoUrl: true,
      plan: true,
      trialEndsAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const deleteUserAccount = async (userId) => {
  // Supprimer l'utilisateur (cascade delete géré par Prisma)
  await prisma.user.delete({
    where: { id: userId }
  });
};
