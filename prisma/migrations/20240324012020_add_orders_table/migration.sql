-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "shopUrl" TEXT NOT NULL,
    "frameId" INTEGER NOT NULL,
    "purchasedBy" INTEGER NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "timePlaced" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
