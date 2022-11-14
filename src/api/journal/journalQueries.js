const fetchJournal = async (parent, args, context) => {
  const { userId } = context;

  const dateGte = args.date_gte || `${args.year}-09-01T00:00:00.000Z`;
  const dateLte = args.date_lte || `${args.year + 1}-05-31T00:00:00.000Z`;

  const students = await context.prisma.teacher_Course_Student.findMany({
    where: {
      teacherId: args.teacherId,
      courseId: args.courseId,
      FreezeVersion: args.year ? {
        year: args.year
      } : null
    },
    include: {
      journalEntry: {
        orderBy: {
          date: "asc"
        },
        where: {
          date: {
            gte: dateGte,
            lte: dateLte
          }
        }
      },
      quaterMark: {
        where: {
          year: args.year
        }
      },
      student: true
    }
  });

  const hours = await context.prisma.teacher_Course_Student.findMany({
    where: {
      teacherId: args.teacherId,
      courseId: args.courseId
    },
    select: {
      journalEntry: {
        where: {
          date: {
            gte: `${args.year}-09-01T00:00:00.000Z`,
            lte: `${args.year + 1}-05-31T00:00:00.000Z`
          }
        }
      }
    }
  });

  return students.map((student, index) => ({
    ...student,
    hours: hours[index].journalEntry.length
  }));
};

module.exports = {
  fetchJournal
};