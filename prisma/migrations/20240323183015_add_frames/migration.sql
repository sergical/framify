-- CreateTable
CREATE TABLE "Frame" (
    "id" SERIAL NOT NULL,
    "fid" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "checkoutUrl" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Frame_pkey" PRIMARY KEY ("id")
);
