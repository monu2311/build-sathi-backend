import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createQuoteController,
  getSellerQuoteByIdController,
  getSellerQuotesController,
} from "./quote.controller";

const router = Router();

router.post("/", authMiddleware, createQuoteController);
router.get("/seller", authMiddleware, getSellerQuotesController);

router.get(
    '/:id',
    authMiddleware,
    getSellerQuoteByIdController,
  );


export default router;
