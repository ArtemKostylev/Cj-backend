const updateNote = async (parent, args, context, info) => {
  return await context.prisma.note.upsert({
    where: {
      id: args.data.id,
    },
    update: {
      text: args.data.text,
    },
    create: {
      text: args.data.text,
      year: args.data.year,
      teacherId: args.data.teacherId,
      courseId: args.data.courseId,
    },
  });
};

const deleteNote = async (parent, args, context, info) => {
  await context.prisma.course.delete({
    where: {
      id: args.id,
    },
  });
};

module.exports = {
  updateNote,
  deleteNote
}