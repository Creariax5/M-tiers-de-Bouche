import { updateProfileSchema } from '../validators/profile.validator.js';
import { updateUserProfile, deleteUserAccount } from '../services/profile.service.js';
import prisma from '../lib/prisma.js';

export const updateProfile = async (req, res) => {
  try {
    // Validation (permettre un objet vide)
    if (Object.keys(req.body).length === 0) {
      // Retourner le profil actuel sans modification
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
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
      
      return res.json({ 
        user: {
          userId: user.id,
          ...user,
          id: undefined
        }
      });
    }

    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        errors: validation.error.flatten().fieldErrors 
      });
    }

    // Mettre à jour le profil
    const updatedUser = await updateUserProfile(req.user.userId, validation.data);

    res.json({ 
      user: {
        userId: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        company: updatedUser.company,
        logoUrl: updatedUser.logoUrl,
        plan: updatedUser.plan,
        trialEndsAt: updatedUser.trialEndsAt,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }
    
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await deleteUserAccount(req.user.userId);
    
    res.json({ 
      message: 'Votre compte a été supprimé avec succès' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
};
