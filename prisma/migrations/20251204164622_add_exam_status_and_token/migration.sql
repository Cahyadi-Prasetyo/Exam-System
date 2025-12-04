/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Exam_token_key" ON "Exam"("token");
