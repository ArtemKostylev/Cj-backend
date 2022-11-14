const fetchStudents = async (parent, args, context) => {
  const { userId } = context;
  return await context.prisma.student.findMany(
    {
      where: {
        FreezeVersion: null
      }
    }
  );
};

module.exports = {
  fetchStudents
};