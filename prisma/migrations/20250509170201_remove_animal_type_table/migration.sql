/*
  Warnings:

  - You are about to drop the `AnimalType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_animalTypeCode_fkey";

-- DropTable
DROP TABLE "AnimalType";
