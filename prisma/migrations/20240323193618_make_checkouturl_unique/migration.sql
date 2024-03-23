/*
  Warnings:

  - A unique constraint covering the columns `[checkoutUrl]` on the table `Frame` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Frame_checkoutUrl_key" ON "Frame"("checkoutUrl");
