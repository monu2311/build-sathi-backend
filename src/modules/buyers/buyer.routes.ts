import { Router } from 'express';

import {
  getProfile,
  saveBuyerProfile,
} from './buyer.controller';

import {
  authMiddleware,
} from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/profile',
  authMiddleware,
  getProfile,
);

router.post(
  '/profile',
  authMiddleware,
  saveBuyerProfile,
);

router.patch(
  '/profile',
  authMiddleware,
  saveBuyerProfile,
);

export default router;