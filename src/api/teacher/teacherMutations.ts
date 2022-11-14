import { Resolver } from "../../@types/resolvers";

type UpdateArgs = {
  data: {
    id: number;
    name: string;
    surname: string;
    parent: string;
  },
}

const updateTeacher: Resolver<UpdateArgs> = async (_c, { data }, context, info) => {
  return await context.prisma.teacher.update({
    where: {
      id: data.id
    },
    data: {
      name: data.name,
      surname: data.surname,
      parent: data.parent
    }
  });
};

type DeleteArgs = {
  id: number;
}

const deleteTeacher: Resolver<DeleteArgs> = async (_, args, context, info) => {
  await context.prisma.teacher.delete({
    where: {
      id: args.id
    }
  });
};

const createTeacher: Resolver<UpdateArgs> = async (_, args, context, info) => {
  await context.prisma.teacher.create({
    data: {
      name: args.data.name,
      surname: args.data.surname,
      parent: args.data.parent
    }
  });
};

module.exports = {
  updateTeacher,
  deleteTeacher,
  createTeacher
};
