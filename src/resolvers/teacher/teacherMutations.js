const updateTeacher = async (_, args, context, info) => {
  return await context.prisma.teacher.update({
    where: {
      id: args.data.id,
    },
    data: {
      name: args.data.name,
      surname: args.data.surname,
      parent: args.data.parent,
    },
  });
};

const deleteTeacher = async (_, args, context, info) => {
  await context.prisma.teacher.delete({
    where: {
      id: args.id,
    },
  });
};

const createTeacher = async (_, args, context, info) => {
  await context.prisma.teacher.create({
    data: {
      name: args.data.name,
      surname: args.data.surname,
      parent: args.parent,
    },
  });
};

module.exports = {
  updateTeacher,
  deleteTeacher,
  createTeacher,
};
