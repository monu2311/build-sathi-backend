-- CreateTable
CREATE TABLE "RegistrationOtp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "selectedRole" "UserRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationOtp_email_key" ON "RegistrationOtp"("email");

-- CreateIndex
CREATE INDEX "RegistrationOtp_email_idx" ON "RegistrationOtp"("email");

-- CreateIndex
CREATE INDEX "RegistrationOtp_otpExpiresAt_idx" ON "RegistrationOtp"("otpExpiresAt");
