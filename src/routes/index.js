import express from 'express';
import faceRoutes from '../modules/face/index.js';

const router = express.Router();
router.use('/face', faceRoutes);

export default router;
