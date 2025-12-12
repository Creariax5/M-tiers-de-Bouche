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
