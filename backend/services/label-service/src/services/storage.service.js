import { minioClient, BUCKET_NAME } from '../lib/minio.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadLabel = async (pdfBuffer, userId) => {
  const fileName = `${userId}/${uuidv4()}.pdf`;
  
  const metaData = {
    'Content-Type': 'application/pdf',
    'X-Amz-Meta-UserId': userId
  };

  await minioClient.putObject(BUCKET_NAME, fileName, pdfBuffer, pdfBuffer.length, metaData);
  
  // Retourner l'URL (ou le chemin)
  // Note: Pour une URL signée temporaire: await minioClient.presignedGetObject(BUCKET_NAME, fileName, 24*60*60)
  return fileName;
};

export const getLabelUrl = async (fileName) => {
  return await minioClient.presignedGetObject(BUCKET_NAME, fileName, 24 * 60 * 60); // Valide 24h
};
