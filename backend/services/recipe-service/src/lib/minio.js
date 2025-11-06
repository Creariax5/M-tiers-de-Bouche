import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
});

const BUCKET_NAME = 'recipes';

// Créer le bucket s'il n'existe pas
const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ Bucket "${BUCKET_NAME}" created`);
    }
  } catch (error) {
    console.error('❌ Error ensuring bucket:', error);
  }
};

// Initialiser au démarrage
if (process.env.NODE_ENV !== 'test') {
  ensureBucket();
}

export { minioClient, BUCKET_NAME, ensureBucket };
