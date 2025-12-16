import express from 'express';
import * as labelController from '../controllers/label.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/preview', authenticateToken, labelController.previewLabel);
router.post('/generate', authenticateToken, labelController.generateLabel);
router.get('/', authenticateToken, labelController.getHistory);
router.delete('/:id', authenticateToken, labelController.deleteLabel);
router.get('/view/:fileName(*)', authenticateToken, labelController.viewLabel);

export default router;
