import express from 'express';
import * as labelController from '../controllers/label.controller.js';

const router = express.Router();

router.post('/generate', labelController.generateLabel);

export default router;
