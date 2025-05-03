/*
  Warnings:

  - Added the required column `updatedAt` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "googleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalCustomFieldValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "animalCustomFieldId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalCustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchievementCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementCustomFieldValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "achievementCustomFieldId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchievementCustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "AnimalCustomField_id_idx" ON "AnimalCustomField"("id");

-- CreateIndex
CREATE INDEX "AnimalCustomField_userId_idx" ON "AnimalCustomField"("userId");

-- CreateIndex
CREATE INDEX "AnimalCustomFieldValue_id_idx" ON "AnimalCustomFieldValue"("id");

-- CreateIndex
CREATE INDEX "AnimalCustomFieldValue_animalCustomFieldId_idx" ON "AnimalCustomFieldValue"("animalCustomFieldId");

-- CreateIndex
CREATE INDEX "AnimalCustomFieldValue_animalId_idx" ON "AnimalCustomFieldValue"("animalId");

-- CreateIndex
CREATE INDEX "AchievementCustomField_id_idx" ON "AchievementCustomField"("id");

-- CreateIndex
CREATE INDEX "AchievementCustomField_userId_idx" ON "AchievementCustomField"("userId");

-- CreateIndex
CREATE INDEX "AchievementCustomFieldValue_id_idx" ON "AchievementCustomFieldValue"("id");

-- CreateIndex
CREATE INDEX "AchievementCustomFieldValue_achievementCustomFieldId_idx" ON "AchievementCustomFieldValue"("achievementCustomFieldId");

-- CreateIndex
CREATE INDEX "AchievementCustomFieldValue_achievementId_idx" ON "AchievementCustomFieldValue"("achievementId");

-- CreateIndex
CREATE INDEX "Achievement_id_idx" ON "Achievement"("id");

-- CreateIndex
CREATE INDEX "Achievement_userId_idx" ON "Achievement"("userId");

-- CreateIndex
CREATE INDEX "Animal_userId_idx" ON "Animal"("userId");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalCustomField" ADD CONSTRAINT "AnimalCustomField_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalCustomFieldValue" ADD CONSTRAINT "AnimalCustomFieldValue_animalCustomFieldId_fkey" FOREIGN KEY ("animalCustomFieldId") REFERENCES "AnimalCustomField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalCustomFieldValue" ADD CONSTRAINT "AnimalCustomFieldValue_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCustomField" ADD CONSTRAINT "AchievementCustomField_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCustomFieldValue" ADD CONSTRAINT "AchievementCustomFieldValue_achievementCustomFieldId_fkey" FOREIGN KEY ("achievementCustomFieldId") REFERENCES "AchievementCustomField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementCustomFieldValue" ADD CONSTRAINT "AchievementCustomFieldValue_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
