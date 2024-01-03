/*
  Warnings:

  - Added the required column `university_id` to the `Stillage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stillage" ADD COLUMN     "university_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Stillage_university_id_idx" ON "Stillage"("university_id");

-- AddForeignKey
ALTER TABLE "Stillage" ADD CONSTRAINT "Stillage_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
