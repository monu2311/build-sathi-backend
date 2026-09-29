import { Router } from 'express';

import {
  getAddresses,
  getAddress,
  saveAddress,
  updateAddress,
  removeAddress,
  makeDefaultAddress,
} from './address.controller';

import {
  authMiddleware,
} from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  getAddresses,
);

router.get(
  '/:id',
  getAddress,
);

router.post(
  '/',
  saveAddress,
);

router.patch(
  '/:id',
  updateAddress,
);

router.patch(
  '/:id/default',
  makeDefaultAddress,
);

router.delete(
  '/:id',
  removeAddress,
);

export default router;