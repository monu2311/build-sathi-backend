/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `RegistrationOtp` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `RegistrationOtp` table. All the data in the column will be lost.
  - You are about to drop the column `selectedRole` on the `RegistrationOtp` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `RegistrationOtp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RegistrationOtp_otpExpiresAt_idx";

-- AlterTable
ALTER TABLE "RegistrationOtp" DROP COLUMN "emailVerified",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "selectedRole",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "RegistrationOtp_expiresAt_idx" ON "RegistrationOtp"("expiresAt");
