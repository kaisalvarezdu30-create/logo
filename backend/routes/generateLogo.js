import { Router } from 'express';
import {
  generateLogoHandler,
  toSvgHandler,
  placeholderSvgHandler,
} from '../controllers/logoController.js';

const router = Router();

router.post('/generate', generateLogoHandler);
router.post('/to-svg', toSvgHandler);
router.get('/placeholder-svg', placeholderSvgHandler);

export default router;
