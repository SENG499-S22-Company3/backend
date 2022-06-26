/*
  Warnings:

  - You are about to drop the column `userId` on the `CoursePreference` table. All the data in the column will be lost.
  - You are about to drop the column `meetingTimeId` on the `CourseSection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subject,courseCode,term]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teachPreferenceId,preference,courseId]` on the table `CoursePreference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[startTime,endTime,days,courseSectionId]` on the table `MeetingTime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `TeachingPreference` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `term` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CoursePreference" DROP CONSTRAINT "CoursePreference_userId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSection" DROP CONSTRAINT "CourseSection_meetingTimeId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "term",
ADD COLUMN     "term" "Term" NOT NULL;

-- AlterTable
ALTER TABLE "CoursePreference" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "CourseSection" DROP COLUMN "meetingTimeId";

-- AlterTable
ALTER TABLE "MeetingTime" ADD COLUMN     "courseSectionId" INTEGER;

-- AlterTable
ALTER TABLE "TeachingPreference" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Course_subject_courseCode_term_key" ON "Course"("subject", "courseCode", "term");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePreference_teachPreferenceId_preference_courseId_key" ON "CoursePreference"("teachPreferenceId", "preference", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingTime_startTime_endTime_days_courseSectionId_key" ON "MeetingTime"("startTime", "endTime", "days", "courseSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingPreference_userId_key" ON "TeachingPreference"("userId");

-- AddForeignKey
ALTER TABLE "TeachingPreference" ADD CONSTRAINT "TeachingPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingTime" ADD CONSTRAINT "MeetingTime_courseSectionId_fkey" FOREIGN KEY ("courseSectionId") REFERENCES "CourseSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
