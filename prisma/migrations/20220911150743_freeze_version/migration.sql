-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "freezeVersionId" INTEGER;

-- AlterTable
ALTER TABLE "Specialization" ADD COLUMN     "freezeVersionId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "freezeVersionId" INTEGER;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "freezeVersionId" INTEGER;

-- AlterTable
ALTER TABLE "Teacher_Course_Student" ADD COLUMN     "freezeVersionId" INTEGER;

-- CreateTable
CREATE TABLE "FreezeVersion" (
    "id" SERIAL NOT NULL,
    "version" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Teacher" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD FOREIGN KEY ("freezeVersionId") REFERENCES "FreezeVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY ("freezeVersionId") REFERENCES "FreezeVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD FOREIGN KEY ("freezeVersionId") REFERENCES "FreezeVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher_Course_Student" ADD FOREIGN KEY ("freezeVersionId") REFERENCES "FreezeVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialization" ADD FOREIGN KEY ("freezeVersionId") REFERENCES "FreezeVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
