/*
  Warnings:

  - You are about to drop the column `animalTypeId` on the `Animal` table. All the data in the column will be lost.
  - The primary key for the `AnimalType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AnimalType` table. All the data in the column will be lost.
  - Added the required column `animalTypeCode` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_animalTypeId_fkey";

-- DropIndex
DROP INDEX "Animal_animalTypeId_idx";

-- DropIndex
DROP INDEX "AnimalType_code_key";

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "animalTypeId",
ADD COLUMN     "animalTypeCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AnimalType" DROP CONSTRAINT "AnimalType_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AnimalType_pkey" PRIMARY KEY ("code");

-- CreateIndex
CREATE INDEX "Animal_animalTypeCode_idx" ON "Animal"("animalTypeCode");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_animalTypeCode_fkey" FOREIGN KEY ("animalTypeCode") REFERENCES "AnimalType"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
