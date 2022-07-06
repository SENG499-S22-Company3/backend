/*
  Warnings:

  - Added the required column `streamSequence` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sengRatio" DOUBLE PRECISION NOT NULL DEFAULT 0.75,
ADD COLUMN     "streamSequence" TEXT NOT NULL;
