/*
  Warnings:

  - You are about to drop the `achievements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "achievements";

-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuedBy" TEXT,
    "issuedAt" TEXT,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);
