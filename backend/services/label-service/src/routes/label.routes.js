import express from 'express';
import * as labelController from '../controllers/label.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', authenticateToken, labelController.generateLabel);

export default router;
