/*
  Warnings:

  - You are about to drop the `CourseSections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeetingTimes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeachingPreferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseSections" DROP CONSTRAINT "CourseSections_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSections" DROP CONSTRAINT "CourseSections_meetingTimesId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSections" DROP CONSTRAINT "CourseSections_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "CourseSections" DROP CONSTRAINT "CourseSections_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeachingPreferences" DROP CONSTRAINT "TeachingPreferences_courseId_fkey";

-- DropForeignKey
ALTER TABLE "TeachingPreferences" DROP CONSTRAINT "TeachingPreferences_courseSectionId_fkey";

-- DropTable
DROP TABLE "CourseSections";

-- DropTable
DROP TABLE "Courses";

-- DropTable
DROP TABLE "MeetingTimes";

-- DropTable
DROP TABLE "Schedules";

-- DropTable
DROP TABLE "TeachingPreferences";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "hasPeng" BOOLEAN NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSection" (
    "id" SERIAL NOT NULL,
    "hoursPerWeek" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "meetingTimeId" INTEGER NOT NULL,
    "userId" INTEGER,
    "courseId" INTEGER NOT NULL,
    "scheduleId" INTEGER,

    CONSTRAINT "CourseSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "term" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingPreference" (
    "id" SERIAL NOT NULL,
    "preference" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "TeachingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingTime" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "days" "Day"[],

    CONSTRAINT "MeetingTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_meetingTimeId_fkey" FOREIGN KEY ("meetingTimeId") REFERENCES "MeetingTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingPreference" ADD CONSTRAINT "TeachingPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingPreference" ADD CONSTRAINT "TeachingPreference_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
