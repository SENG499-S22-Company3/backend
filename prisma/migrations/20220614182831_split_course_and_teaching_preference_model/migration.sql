/*
  Warnings:

  - You are about to drop the column `courseId` on the `TeachingPreference` table. All the data in the column will be lost.
  - You are about to drop the column `preference` on the `TeachingPreference` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TeachingPreference` table. All the data in the column will be lost.
  - Added the required column `hasRelief` to the `TeachingPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyLeave` to the `TeachingPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicsOrGradCourse` to the `TeachingPreference` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Term" AS ENUM ('FALL', 'SPRING', 'SUMMER');

-- DropForeignKey
ALTER TABLE "TeachingPreference" DROP CONSTRAINT "TeachingPreference_courseId_fkey";

-- DropForeignKey
ALTER TABLE "TeachingPreference" DROP CONSTRAINT "TeachingPreference_userId_fkey";

-- AlterTable
ALTER TABLE "TeachingPreference" DROP COLUMN "courseId",
DROP COLUMN "preference",
DROP COLUMN "userId",
ADD COLUMN     "hasRelief" BOOLEAN NOT NULL,
ADD COLUMN     "nonTeachingTerm1" "Term",
ADD COLUMN     "nonTeachingTerm2" "Term",
ADD COLUMN     "reliefReason" TEXT,
ADD COLUMN     "studyLeave" BOOLEAN NOT NULL,
ADD COLUMN     "studyLeaveReason" TEXT,
ADD COLUMN     "topicsOrGradCourse" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "CoursePreference" (
    "id" SERIAL NOT NULL,
    "preference" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER,
    "teachPreferenceId" INTEGER,

    CONSTRAINT "CoursePreference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoursePreference" ADD CONSTRAINT "CoursePreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePreference" ADD CONSTRAINT "CoursePreference_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePreference" ADD CONSTRAINT "CoursePreference_teachPreferenceId_fkey" FOREIGN KEY ("teachPreferenceId") REFERENCES "TeachingPreference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
