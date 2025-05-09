/*
  Warnings:

  - You are about to drop the column `animalTypeCode` on the `Animal` table. All the data in the column will be lost.
  - Added the required column `animalType` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnimalType" AS ENUM ('DOG', 'CAT', 'BIRD', 'FISH', 'REPTILE', 'OTHER');

-- DropIndex
DROP INDEX "Animal_animalTypeCode_idx";

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "animalTypeCode",
ADD COLUMN     "animalType" "AnimalType" NOT NULL;
