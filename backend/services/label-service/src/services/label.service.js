import prisma from '../lib/prisma.js';

export const createLabel = async (data) => {
  return await prisma.label.create({
    data: {
      userId: data.userId,
      productName: data.productName,
      fileName: data.fileName,
      format: data.format,
      template: data.template
    }
  });
};

export const getLabelsByUser = async (userId) => {
  return await prisma.label.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteLabel = async (id, userId) => {
  // Vérifier que l'étiquette appartient à l'utilisateur
  const label = await prisma.label.findFirst({
    where: { id, userId }
  });
  
  if (!label) {
    throw new Error('Label not found or access denied');
  }

  return await prisma.label.delete({
    where: { id }
  });
};
