import { prisma } from '../../config/database';

interface BuyerProfileData {
  name: string;
  phoneNumber?: string;
  companyName?: string;
  state: string;
  city: string;
  pincode: string;
  completeAddress: string;
}

export const createOrUpdateBuyerProfile = async (
    userId: string,
    data: BuyerProfileData,
  ) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    if (user.role !== 'BUYER') {
      throw new Error(
        'Only buyer can create buyer profile',
      );
    }
  
    // UPDATE USER NAME
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
      },
    });
  
    // CREATE / UPDATE BUYER PROFILE
    const profile =
      await prisma.buyerProfile.upsert({
        where: {
          userId,
        },
  
        create: {
          userId,
          phoneNumber: data.phoneNumber,
          companyName: data.companyName,
          state: data.state,
          city: data.city,
          pincode: data.pincode,
          completeAddress:
            data.completeAddress,
        },
  
        update: {
          phoneNumber: data.phoneNumber,
          companyName: data.companyName,
          state: data.state,
          city: data.city,
          pincode: data.pincode,
          completeAddress:
            data.completeAddress,
        },
      });
  
    return {
      profile: {
        id: profile.id,
        name: data.name,
        phoneNumber: profile.phoneNumber,
        email: user.email,
        companyName: profile.companyName,
        state: profile.state,
        city: profile.city,
        pincode: profile.pincode,
        completeAddress:
          profile.completeAddress,
      },
    };
  };

export const getBuyerProfile = async (
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      buyerProfile: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== 'BUYER') {
    throw new Error(
      'Only buyer can access buyer profile',
    );
  }

  return {
    profile: {
      id: user.buyerProfile?.id || null,
      name: user.name,
      phoneNumber:
        user.buyerProfile?.phoneNumber ||
        user.phone ||
        null,
      email: user.email,
      companyName:
        user.buyerProfile?.companyName || null,
      state:
        user.buyerProfile?.state || null,
      city:
        user.buyerProfile?.city || null,
      pincode:
        user.buyerProfile?.pincode || null,
      completeAddress:
        user.buyerProfile?.completeAddress ||
        null,
    },
  };
};