import {Response} from 'express';
import {AuthRequest} from '../../middleware/auth.middleware';
import {createQuote, getSellerQuoteById, getSellerQuotes} from './quote.service';

export const createQuoteController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const sellerId = req.user?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const {
      requirementId,
      pricePerUnit,
      deliveryCharges,
      deliveryTime,
      validity,
      message,
    } = req.body;

    if (!requirementId) {
      return res.status(400).json({
        success: false,
        message: 'Requirement ID is required',
      });
    }

    if (
      pricePerUnit === undefined ||
      Number(pricePerUnit) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid price per unit is required',
      });
    }

    if (!deliveryTime) {
      return res.status(400).json({
        success: false,
        message: 'Delivery time is required',
      });
    }

    if (!validity) {
      return res.status(400).json({
        success: false,
        message: 'Quote validity is required',
      });
    }

    const quote = await createQuote({
      requirementId,
      sellerId,
      pricePerUnit: Number(pricePerUnit),
      deliveryCharges:
        Number(deliveryCharges || 0),
      deliveryTime,
      validity,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Quote sent successfully',
      data: {
        quote,
      },
    });
  } catch (error: any) {
    console.error('CREATE QUOTE ERROR:', error);

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        'Unable to send quote',
    });
  }
};

export const getSellerQuotesController = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const sellerId = req.user?.userId;
  
      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
  
      const quotes = await getSellerQuotes(sellerId);
  
      return res.status(200).json({
        success: true,
        message: 'Seller quotes fetched successfully',
        data: {
          quotes,
        },
      });
    } catch (error: any) {
      console.error('GET SELLER QUOTES ERROR:', error);
  
      return res.status(500).json({
        success: false,
        message: error?.message || 'Unable to fetch seller quotes',
      });
    }
  };

  export const getSellerQuoteByIdController = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const sellerId = req.user?.userId;
  
      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
  
      const quoteId = req.params.id;
  
      if (!quoteId) {
        return res.status(400).json({
          success: false,
          message: 'Quote ID is required',
        });
      }
  
      const quote = await getSellerQuoteById(
        quoteId,
        sellerId,
      );
  
      return res.status(200).json({
        success: true,
        message: 'Seller quote details fetched successfully',
        data: {
          quote,
        },
      });
    } catch (error: any) {
      console.error('GET SELLER QUOTE DETAILS ERROR:', error);
  
      return res.status(404).json({
        success: false,
        message:
          error?.message || 'Unable to fetch quote details',
      });
    }
  };