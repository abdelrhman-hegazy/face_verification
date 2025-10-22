import express from 'express';
import { upload } from './face.middleware.js';
import { encode, compare } from './face.controller.js';

const router = express.Router();

router.post('/encode', upload.single('image'), encode);
router.post('/compare', upload.single('image'), compare);

export default router;

