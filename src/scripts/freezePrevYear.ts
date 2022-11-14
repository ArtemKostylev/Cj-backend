import { PrismaClient } from "@prisma/client";

async function main() {
  const year = parseInt(process.argv[2]);

  if (!year) throw new Error("Empty year");

  const prisma = new PrismaClient();

  return await prisma.$transaction(async (prisma) => {
    const freezeVersion = await prisma.freezeVersion.create({
      data: { year }
    });

    const currentStudents = await prisma.student.findMany({
      where: {
        freezeVersionId: null
      }
    });

    const currentTeachers = await prisma.teacher.findMany({
      where: {
        freezeVersionId: null
      }
    });

    const currentCourses = await prisma.course.findMany({
      where: {
        freezeVersionId: null
      }
    });

    const currentSpecializations = await prisma.specialization.findMany({
      where: {
        freezeVersionId: null
      }
    });

    const currentRelations = await prisma.teacher_Course_Student.findMany({
      where: {
        freezeVersionId: null
      }
    });

    const newSpecializations = await Promise.all(currentSpecializations.map((spec) => {
      const newSpec = prisma.specialization.create({
        data: {
          name: spec.name
        }
      });

      prisma.specialization.update({
        where: {
          id: spec.id
        },
        data: {
          freezeVersionId: freezeVersion.id
        }
      });

      return [spec.id, newSpec];
    })) as [number, any][];

    const specMap = new Map(newSpecializations);

    const newStudents = await Promise.all(currentStudents.map((student) => {
      const newStudent = prisma.student.create({
        data: {
          name: student.name,
          surname: student.surname,
          class: student.class,
          program: student.program,
          specializationId: student.specializationId ? specMap.get(student.specializationId).id : null
        }
      });

      prisma.student.update({
        where: {
          id: student.id
        },
        data: {
          freezeVersionId: freezeVersion.id
        }
      });

      return [student.id, newStudent];
    })) as [number, any][];

    const studentMap = new Map(newStudents);

    const newTeachers = await Promise.all(currentTeachers.map((teacher) => {
      const newTeacher = prisma.teacher.create({
        data: {
          name: teacher.name,
          surname: teacher.surname,
          parent: teacher.parent,
          userId: teacher.userId
        }
      });

      prisma.teacher.update({
        where: {
          id: teacher.id
        },
        data: {
          freezeVersionId: freezeVersion.id
        }
      });

      return [teacher.id, newTeacher];
    })) as [number, any][];

    const teachersMap = new Map(newTeachers);

    const newCourses = await Promise.all(currentCourses.map((course) => {
      const newCourse = prisma.course.create({
        data: {
          name: course.name,
          group: course.group,
          excludeFromReport: course.excludeFromReport,
          onlyHours: course.onlyHours,
          onlyGroups: course.onlyGroups,
          parentId: course.parentId
        }
      });

      prisma.course.update({
        where: {
          id: course.id
        },
        data: {
          freezeVersionId: freezeVersion.id
        }
      });

      return [course.id, newCourse];
    })) as [number, any][];

    const courseMap = new Map(newCourses);


    console.log(courseMap, teachersMap, studentMap);

    return await Promise.all(currentRelations.map((relation) => {
      const newRelation = prisma.teacher_Course_Student.create({
        data: {
          teacherId: teachersMap.get(relation.teacherId).id,
          courseId: courseMap.get(relation.courseId).id,
          studentId: relation.studentId ? studentMap.get(relation.studentId).id : null,
          subgroup: relation.subgroup
        }
      });

      prisma.teacher_Course_Student.update({
        where: {
          id: relation.id
        },
        data: {
          freezeVersionId: freezeVersion.id
        }
      });

      return newRelation;
    }));
  });
}

main().then(() => console.log("DONE"));
