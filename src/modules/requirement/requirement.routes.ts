import {Router} from 'express';
import {authMiddleware} from '../../middleware/auth.middleware';
import {createRequirementController, getBuyerRequirementByIdController, getBuyerRequirementsController} from './requirement.controller';

const router = Router();

router.get(
  '/',
  authMiddleware,
  getBuyerRequirementsController,
);
router.get(
  '/:id',
  authMiddleware,
  getBuyerRequirementByIdController,
);

router.post(
  '/',
  authMiddleware,
  createRequirementController,
);

export default router;