/*
  Warnings:

  - You are about to drop the column `private_property_status` on the `Stillage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stillage" DROP COLUMN "private_property_status",
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT true;
