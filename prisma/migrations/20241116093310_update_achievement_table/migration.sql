/*
  Warnings:

  - You are about to drop the `Achievements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Achievements";

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuedBy" TEXT,
    "issuedAt" TEXT,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);
