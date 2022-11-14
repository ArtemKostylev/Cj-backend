const fetchTeachers = async (_, args, context) => {
  const { userId } = context;
  return await context.prisma.teacher.findMany({
    where: {
      FreezeVersion: null
    },
    include: {
      relations: {
        distinct: ["courseId"],
        select: {
          course: true
        }
      }
    }
  });
};

module.exports = {
  fetchTeachers
};
