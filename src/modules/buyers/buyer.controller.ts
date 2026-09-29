import { Response } from "express";

import { AuthRequest } from "../../middleware/auth.middleware";

import { createOrUpdateBuyerProfile, getBuyerProfile } from "./buyer.service";

export const saveBuyerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      name,
      phoneNumber,
      companyName,
      state,
      city,
      pincode,
      completeAddress,
    } = req.body || {};
    // Full name validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 2 characters",
      });
    }

    if (!state || !city || !pincode || !completeAddress) {
      return res.status(400).json({
        success: false,
        message: "State, city, pincode and complete address are required",
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 6 digits",
      });
    }

    if (
      phoneNumber &&
      !/^[+]?[0-9]{10,15}$/.test(phoneNumber.replace(/\s/g, ""))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const result = await createOrUpdateBuyerProfile(userId, {
      name: name.trim(),
      phoneNumber: phoneNumber?.trim() || undefined,
      companyName: companyName?.trim() || undefined,
      state: state.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      completeAddress: completeAddress.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Buyer profile saved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to save buyer profile",
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await getBuyerProfile(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to get buyer profile",
    });
  }
};
