/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Stillage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Forum" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Stillage_name_userId_key" ON "Stillage"("name", "userId");
