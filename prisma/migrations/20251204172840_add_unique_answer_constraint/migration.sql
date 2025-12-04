/*
  Warnings:

  - A unique constraint covering the columns `[examAttemptId,questionId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Answer_examAttemptId_questionId_key" ON "Answer"("examAttemptId", "questionId");
