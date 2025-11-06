import prisma from '../lib/prisma.js';
import { minioClient, BUCKET_NAME, ensureBucket } from '../lib/minio.js';
import sharp from 'sharp';
import multer from 'multer';
import crypto from 'crypto';

// Configuration multer (memory storage)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware multer avec error handling
export const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Erreur Multer (fichier trop gros, etc.)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds the 5MB limit' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Autre erreur (type de fichier invalide)
      return res.status(400).json({ error: err.message });
    }
    // Pas d'erreur, continuer
    next();
  });
};

// Controller upload image
export const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Vérifier que le fichier existe
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Vérifier ownership de la recette
    const recipe = await prisma.recipe.findFirst({
      where: { id, userId },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Compresser l'image avec Sharp (max 1200px width, quality 80%)
    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Générer un nom de fichier unique
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.jpg`;
    const objectName = `recipes/${userId}/${filename}`;

    // S'assurer que le bucket existe
    await ensureBucket();

    // Upload vers MinIO
    await minioClient.putObject(BUCKET_NAME, objectName, compressedBuffer, compressedBuffer.length, {
      'Content-Type': 'image/jpeg',
    });

    // Générer URL (en dev, utiliser localhost:9000)
    const imageUrl = `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}/${BUCKET_NAME}/${objectName}`;

    // Update Recipe.imageUrl
    await prisma.recipe.update({
      where: { id },
      data: { imageUrl },
    });

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
};
