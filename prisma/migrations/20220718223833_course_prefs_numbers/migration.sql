-- AlterTable
ALTER TABLE "TeachingPreference" ADD COLUMN     "fallTermCourses" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "springTermCourses" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "summerTermCourses" INTEGER NOT NULL DEFAULT 2;
