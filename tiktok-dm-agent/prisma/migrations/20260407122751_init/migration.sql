-- CreateTable
CREATE TABLE "Affiliator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tiktokHandle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "niche" TEXT NOT NULL,
    "avgViews" INTEGER NOT NULL,
    "engageRate" REAL NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DM" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliatorId" TEXT NOT NULL,
    "campaignType" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "commission" TEXT,
    "content" TEXT NOT NULL,
    "sentAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DM_affiliatorId_fkey" FOREIGN KEY ("affiliatorId") REFERENCES "Affiliator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Affiliator_tiktokHandle_key" ON "Affiliator"("tiktokHandle");
