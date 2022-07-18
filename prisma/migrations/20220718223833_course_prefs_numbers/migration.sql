-- AlterTable
ALTER TABLE "TeachingPreference" ADD COLUMN     "fallTermCourses" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "springTermCourses" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "summerTermCourses" INTEGER NOT NULL DEFAULT 1;
