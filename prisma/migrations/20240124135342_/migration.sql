/*
  Warnings:

  - A unique constraint covering the columns `[name,stillageId]` on the table `Shelf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shelf_name_stillageId_key" ON "Shelf"("name", "stillageId");
