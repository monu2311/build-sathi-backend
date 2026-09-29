-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('OPEN', 'QUOTED', 'ACCEPTED', 'ORDERED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "deliveryAddressId" TEXT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "deliveryPreference" TEXT NOT NULL,
    "notes" TEXT,
    "status" "RequirementStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Requirement_buyerId_idx" ON "Requirement"("buyerId");

-- CreateIndex
CREATE INDEX "Requirement_materialId_idx" ON "Requirement"("materialId");

-- CreateIndex
CREATE INDEX "Requirement_deliveryAddressId_idx" ON "Requirement"("deliveryAddressId");

-- CreateIndex
CREATE INDEX "Requirement_status_idx" ON "Requirement"("status");

-- CreateIndex
CREATE INDEX "Requirement_createdAt_idx" ON "Requirement"("createdAt");

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "DeliveryAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
