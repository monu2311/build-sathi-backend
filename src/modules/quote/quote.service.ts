import { prisma } from "../../config/database";
import {
  consumeQuotation,
  getQuotaSummary,
  isTrustedSeller,
} from "../subscription/subscription.service";

interface CreateQuoteInput {
  requirementId: string;
  sellerId: string;
  pricePerUnit: number;
  deliveryCharges?: number;
  deliveryTime: string;
  validity: string;
  message?: string;
}

export const createQuote = async ({
  requirementId,
  sellerId,
  pricePerUnit,
  deliveryCharges = 0,
  deliveryTime,
  validity,
  message,
}: CreateQuoteInput) => {
  const quote = await prisma.$transaction(async (tx) => {
    const requirement = await tx.requirement.findUnique({
      where: {
        id: requirementId,
      },
      include: {
        material: true,
      },
    });

    if (!requirement) {
      throw new Error('Requirement not found');
    }

    if (requirement.status !== 'OPEN') {
      throw new Error(
        'This requirement is no longer accepting quotes',
      );
    }

    if (!pricePerUnit || pricePerUnit <= 0) {
      throw new Error('Valid price per unit is required');
    }

    const quantity = Number(requirement.quantity);

    const materialAmount =
      quantity * Number(pricePerUnit);

    const totalAmount =
      materialAmount + Number(deliveryCharges || 0);

    // Prevent same seller from sending duplicate quote
    const existingQuote = await tx.quote.findFirst({
      where: {
        requirementId,
        sellerId,
        status: 'PENDING',
      },
    });

    if (existingQuote) {
      throw new Error(
        'You have already sent a quote for this requirement',
      );
    }

    // Charge one quotation (10 free lifetime, then paid plan).
    // Throws QuotaExhaustedError when nothing is left. Runs in the same
    // transaction, so a failed quote never uses up a quotation.
    const quota = await consumeQuotation(tx, sellerId);

    return tx.quote.create({
      data: {
        requirementId,
        sellerId,

        pricePerUnit,
        materialAmount,
        deliveryCharges:
          deliveryCharges || 0,
        totalAmount,

        deliveryTime,
        validity,
        message: message || null,

        status: 'PENDING',

        quotaSource: quota.source,
        subscriptionId: quota.subscriptionId,
      },

      include: {
        requirement: {
          include: {
            material: {
              include: {
                category: true,
              },
            },

            deliveryAddress: true,
          },
        },

        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  });

  const [quota, trusted] = await Promise.all([
    getQuotaSummary(sellerId),
    isTrustedSeller(sellerId),
  ]);

  return {
    quote: {
      ...quote,
      seller: {...quote.seller, isTrustedSeller: trusted},
    },
    quota: {
      freeQuotationsRemaining: quota.freeQuota.remaining,
      paidQuotationsRemaining: quota.paidQuotationsRemaining,
      totalQuotationsRemaining: quota.totalQuotationsRemaining,
    },
  };
};

export const getSellerQuotes = async (sellerId: string) => {
    const quotes = await prisma.quote.findMany({
      where: {
        sellerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        requirement: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            material: {
              include: {
                category: true,
              },
            },
            deliveryAddress: {
              select: {
                id: true,
                state: true,
                city: true,
                pincode: true,
                addressLine1: true,
                addressLine2: true,
                landmark: true,
              },
            },
          },
        },
      },
    });
  
    return quotes;
  };

  export const getSellerQuoteById = async (
    quoteId: string,
    sellerId: string,
  ) => {
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
  
        requirement: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
  
            material: {
              include: {
                category: true,
              },
            },
  
            deliveryAddress: {
              select: {
                id: true,
                state: true,
                city: true,
                pincode: true,
                addressLine1: true,
                addressLine2: true,
                landmark: true,
              },
            },
          },
        },
      },
    });
  
    if (!quote) {
      throw new Error('Quote not found');
    }
  
    return quote;
  };