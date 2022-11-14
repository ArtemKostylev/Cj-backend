const fetchReplacements = async (parent, args, context) => {
  const { userId } = context;
  return await context.prisma.teacher_Course_Student.findMany({
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
            gte: args.date_gte,
            lte: args.date_lte
          },
          mark: {
            in: ["Б"]
          }
        },
        include: {
          replacement: true
        }
      },
      student: true
    }
  });
};

module.exports = {
  fetchReplacements
};