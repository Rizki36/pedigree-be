/*
  Warnings:

  - The `issuedAt` column on the `Achievement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "issuedAt",
ADD COLUMN     "issuedAt" TIMESTAMP(3);
