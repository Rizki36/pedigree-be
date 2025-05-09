/*
  Warnings:

  - You are about to drop the column `animalType` on the `Animal` table. All the data in the column will be lost.
  - Added the required column `animalTypeCode` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "animalType",
ADD COLUMN     "animalTypeCode" "AnimalType" NOT NULL;
