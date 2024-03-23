/*
  Warnings:

  - You are about to drop the `Wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expires" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "Wallets";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "fid" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);
