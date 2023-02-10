const fetchNotes = async (parent, args, context) => {
  const { userId } = context;
  return await context.prisma.note.findFirst({
    where: {
      courseId: args.courseId,
      teacherId: args.teacherId,
      year: args.year,
    },
  });
};

module.exports = {
  fetchNotes
}