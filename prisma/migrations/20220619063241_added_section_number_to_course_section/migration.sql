/*
  Warnings:

  - Added the required column `sectionNumber` to the `CourseSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseSection" ADD COLUMN     "sectionNumber" INTEGER NOT NULL;
