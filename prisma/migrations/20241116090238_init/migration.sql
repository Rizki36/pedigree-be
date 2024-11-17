-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender",
    "fatherId" TEXT,
    "motherId" TEXT,
    "note" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "diedAt" TIMESTAMP(3),

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuedBy" TEXT,
    "issuedAt" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Animal_id_idx" ON "Animal"("id");

-- CreateIndex
CREATE INDEX "Animal_code_idx" ON "Animal"("code");

-- CreateIndex
CREATE INDEX "Animal_fatherId_idx" ON "Animal"("fatherId");

-- CreateIndex
CREATE INDEX "Animal_motherId_idx" ON "Animal"("motherId");
