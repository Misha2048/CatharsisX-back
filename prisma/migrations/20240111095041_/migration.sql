/*
  Warnings:

  - Added the required column `property_status` to the `Stillage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stillage" ADD COLUMN     "property_status" TEXT NOT NULL;
