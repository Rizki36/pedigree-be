/*
  Warnings:

  - Added the required column `animalTypeId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "animalTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AnimalType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimalType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalType_code_key" ON "AnimalType"("code");

-- CreateIndex
CREATE INDEX "Animal_animalTypeId_idx" ON "Animal"("animalTypeId");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_animalTypeId_fkey" FOREIGN KEY ("animalTypeId") REFERENCES "AnimalType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
