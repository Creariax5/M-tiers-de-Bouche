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
  // Utiliser l'URL publique directe puisque le bucket est en mode download public
  const externalEndpoint = process.env.MINIO_EXTERNAL_ENDPOINT || 'localhost:9000';
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  return `${protocol}://${externalEndpoint}/${BUCKET_NAME}/${fileName}`;
};

export const downloadLabel = async (fileName) => {
  const chunks = [];
  const stream = await minioClient.getObject(BUCKET_NAME, fileName);
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};
