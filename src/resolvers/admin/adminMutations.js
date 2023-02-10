
const updateCourseRelations = async (parent, args, context, info) => {
  const deleted = args.courses.filter((el) => el.deleted);

  const pendingEntries = await context.prisma.teacher_Course_Student.findMany(
    {
      where: {
        teacherId: args.teacher,
        courseId: { in: args.courses.map((item) => item.id) },
      },
    }
  );

  const newCourses = args.courses.filter(
    (el) => pendingEntries.find((entry) => el.id !== entry.CourseId) //exceeding calls
  );

  // TODO: wtf? Why we have 2 promise all here?
  await Promise.all(
    newCourses.map((item) =>
      context.prisma.teacher_Course_Student.create({
        data: {
          teacherId: args.teacher,
          courseId: item.id,
        },
      })
    )
  );

  await Promise.all(
    pendingEntries.map((entry) => {
      return context.prisma.teacher_Course_Student.update({
        where: {
          id: entry.id,
        },
        data: {
          archived: !!deleted.find((el) => el.id === entry.courseId),
        },
      });
    })
  );
};

const updateStudentRelations = async (parent, args, context, info) => {
  const deleted = args.students.filter((el) => el.archived);

  const newEmptyRelation = await context.prisma.teacher_Course_Student.findMany(
    {
      where: {
        teacherId: args.teacher,
        courseId: args.course,
        studentId: null,
      },
    }
  );

  const pendingEntries = await context.prisma.teacher_Course_Student.findMany(
    {
      where: {
        teacherId: args.teacher,
        courseId: args.course,
        studentId: { in: args.students.map((item) => item.id) },
      },
    }
  );

  const newStudents = args.students.filter(
    (el) =>
      -1 === pendingEntries.findIndex((entry) => el.id === entry.studentId)
  );

  if (newEmptyRelation.length !== 0) {
    await context.prisma.teacher_Course_Student.update({
      where: {
        id: newEmptyRelation[0].id,
      },
      data: {
        studentId: newStudents[0].id,
        deleted: false,
      },
    });
    newStudents.splice(0, 1);
  }

  const createdEntries = newStudents.map(
    async (item) =>
      await context.prisma.teacher_Course_Student.create({
        data: {
          teacherId: args.teacher,
          courseId: args.course,
          studentId: item.id,
        },
      })
  );

  const updatedEntries = pendingEntries.map(async (entry) => {
    return await context.prisma.teacher_Course_Student.update({
      where: {
        id: entry.id,
      },
      data: {
        archived: !!deleted.find((el) => el.id === entry.studentId),
      },
    });
  });
}

module.exports = {
  updateCourseRelations,
  updateStudentRelations
}