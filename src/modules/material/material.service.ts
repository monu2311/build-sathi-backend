import {prisma} from '../../config/database';

interface CreateCategoryData {
  name: string;
  description?: string;
}

interface CreateMaterialData {
  categoryId: string;
  name: string;
  description?: string;
  unit: string;
  imageUrl?: string;
}

interface UpdateMaterialData {
  categoryId?: string;
  name?: string;
  description?: string;
  unit?: string;
  imageUrl?: string;
  isActive?: boolean;
}

// ===============================
// CATEGORY
// ===============================

export const createCategory = async (
  data: CreateCategoryData,
) => {
  const existing = await prisma.materialCategory.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existing) {
    throw new Error('Category already exists');
  }

  return prisma.materialCategory.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const getCategories = async (
  includeInactive = false,
) => {
  return prisma.materialCategory.findMany({
    where: includeInactive
      ? {}
      : {
          isActive: true,
        },
    orderBy: {
      name: 'asc',
    },
    include: {
      materials: {
        where: includeInactive
          ? {}
          : {
              isActive: true,
            },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryData> & {
    isActive?: boolean;
  },
) => {
  const category =
    await prisma.materialCategory.findUnique({
      where: {id},
    });

  if (!category) {
    throw new Error('Category not found');
  }

  return prisma.materialCategory.update({
    where: {id},
    data,
  });
};

// ===============================
// MATERIAL
// ===============================

export const createMaterial = async (
  data: CreateMaterialData,
) => {
  const category =
    await prisma.materialCategory.findUnique({
      where: {
        id: data.categoryId,
      },
    });

  if (!category) {
    throw new Error('Category not found');
  }

  const existing = await prisma.material.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw new Error('Material already exists');
  }

  return prisma.material.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      unit: data.unit,
      imageUrl: data.imageUrl,
      isActive: true,
    },
    include: {
      category: true,
    },
  });
};

// ADMIN - all materials
export const getAdminMaterials = async () => {
  return prisma.material.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
    },
  });
};

// BUYER - only active materials
export const getActiveMaterials = async (
  categoryId?: string,
) => {
  return prisma.material.findMany({
    where: {
      isActive: true,

      ...(categoryId
        ? {
            categoryId,
          }
        : {}),
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      category: true,
    },
  });
};

export const getMaterialById = async (
  id: string,
) => {
  const material = await prisma.material.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  return material;
};

export const updateMaterial = async (
  id: string,
  data: UpdateMaterialData,
) => {
  const material =
    await prisma.material.findUnique({
      where: {id},
    });

  if (!material) {
    throw new Error('Material not found');
  }

  if (data.categoryId) {
    const category =
      await prisma.materialCategory.findUnique({
        where: {
          id: data.categoryId,
        },
      });

    if (!category) {
      throw new Error('Category not found');
    }
  }

  return prisma.material.update({
    where: {id},
    data,
    include: {
      category: true,
    },
  });
};

export const deleteMaterial = async (
  id: string,
) => {
  const material =
    await prisma.material.findUnique({
      where: {id},
    });

  if (!material) {
    throw new Error('Material not found');
  }

  // Soft delete instead of permanently deleting
  return prisma.material.update({
    where: {id},
    data: {
      isActive: false,
    },
  });
};

export const toggleMaterialStatus = async (
  id: string,
) => {
  const material =
    await prisma.material.findUnique({
      where: {id},
    });

  if (!material) {
    throw new Error('Material not found');
  }

  return prisma.material.update({
    where: {id},
    data: {
      isActive: !material.isActive,
    },
  });
};