import { prisma } from '../../config/database';

export interface DeliveryAddressData {
  label?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

/* =========================================================
   GET ALL ADDRESSES
========================================================= */

export const getDeliveryAddresses = async (
  userId: string,
) => {
  const addresses =
    await prisma.deliveryAddress.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

  return addresses;
};

/* =========================================================
   GET SINGLE ADDRESS
========================================================= */

export const getDeliveryAddressById = async (
  userId: string,
  addressId: string,
) => {
  const address =
    await prisma.deliveryAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

  if (!address) {
    throw new Error('Delivery address not found');
  }

  return address;
};

/* =========================================================
   CREATE ADDRESS
========================================================= */

export const createDeliveryAddress = async (
  userId: string,
  data: DeliveryAddressData,
) => {
  const existingCount =
    await prisma.deliveryAddress.count({
      where: {
        userId,
      },
    });

  const shouldBeDefault =
    existingCount === 0 || data.isDefault === true;

  const address =
    await prisma.$transaction(async tx => {
      if (shouldBeDefault) {
        await tx.deliveryAddress.updateMany({
          where: {
            userId,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.deliveryAddress.create({
        data: {
          userId,

          label:
            data.label?.trim() ||
            'Construction Site',

          name: data.name.trim(),

          phone: data.phone.trim(),

          addressLine1:
            data.addressLine1.trim(),

          addressLine2:
            data.addressLine2?.trim() || null,

          landmark:
            data.landmark?.trim() || null,

          city: data.city.trim(),

          state: data.state.trim(),

          pincode: data.pincode.trim(),

          isDefault: shouldBeDefault,
        },
      });
    });

  return address;
};

/* =========================================================
   UPDATE ADDRESS
========================================================= */

export const updateDeliveryAddress = async (
  userId: string,
  addressId: string,
  data: DeliveryAddressData,
) => {
  const existing =
    await prisma.deliveryAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

  if (!existing) {
    throw new Error('Delivery address not found');
  }

  const address =
    await prisma.$transaction(async tx => {
      if (data.isDefault === true) {
        await tx.deliveryAddress.updateMany({
          where: {
            userId,
            id: {
              not: addressId,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.deliveryAddress.update({
        where: {
          id: addressId,
        },

        data: {
          label:
            data.label?.trim() ||
            'Construction Site',

          name: data.name.trim(),

          phone: data.phone.trim(),

          addressLine1:
            data.addressLine1.trim(),

          addressLine2:
            data.addressLine2?.trim() || null,

          landmark:
            data.landmark?.trim() || null,

          city: data.city.trim(),

          state: data.state.trim(),

          pincode: data.pincode.trim(),

          isDefault:
            data.isDefault ?? existing.isDefault,
        },
      });
    });

  return address;
};

/* =========================================================
   DELETE ADDRESS
========================================================= */

export const deleteDeliveryAddress = async (
  userId: string,
  addressId: string,
) => {
  const existing =
    await prisma.deliveryAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

  if (!existing) {
    throw new Error('Delivery address not found');
  }

  await prisma.deliveryAddress.delete({
    where: {
      id: addressId,
    },
  });

  // If deleted address was default,
  // make another address default.
  if (existing.isDefault) {
    const nextAddress =
      await prisma.deliveryAddress.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (nextAddress) {
      await prisma.deliveryAddress.update({
        where: {
          id: nextAddress.id,
        },
        data: {
          isDefault: true,
        },
      });
    }
  }

  return {
    message: 'Delivery address deleted successfully',
  };
};

/* =========================================================
   SET DEFAULT ADDRESS
========================================================= */

export const setDefaultDeliveryAddress =
  async (
    userId: string,
    addressId: string,
  ) => {
    const existing =
      await prisma.deliveryAddress.findFirst({
        where: {
          id: addressId,
          userId,
        },
      });

    if (!existing) {
      throw new Error(
        'Delivery address not found',
      );
    }

    await prisma.$transaction([
      prisma.deliveryAddress.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      }),

      prisma.deliveryAddress.update({
        where: {
          id: addressId,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);

    return {
      message:
        'Default delivery address updated successfully',
    };
  };