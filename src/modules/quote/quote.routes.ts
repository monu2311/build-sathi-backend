import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import {
  createQuoteController,
  getSellerQuoteByIdController,
  getSellerQuotesController,
} from "./quote.controller";

const router = Router();

router.post("/", authMiddleware, requireRole("SELLER"), createQuoteController);
router.get("/seller", authMiddleware, requireRole("SELLER"), getSellerQuotesController);

router.get(
  "/:id",
  authMiddleware,
  requireRole("SELLER"),
  getSellerQuoteByIdController,
);

export default router;