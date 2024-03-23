-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP WITHOUT TIME ZONE,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT
);

-- Wallets
CREATE TABLE "Wallets" (
    "id" SERIAL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "fid"  TEXT NOT NULL,
    "address" TEXT NOT NULL
);