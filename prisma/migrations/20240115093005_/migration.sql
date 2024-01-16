/*
  Warnings:

  - You are about to drop the column `property_status` on the `Stillage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stillage" DROP COLUMN "property_status",
ADD COLUMN     "private_property_status" BOOLEAN NOT NULL DEFAULT true;
