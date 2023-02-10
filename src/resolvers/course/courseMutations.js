const updateCourse = async (parent, args, context, info) => {
  return await context.prisma.course.update({
    where: {
      id: args.data.id,
    },
    data: {
      name: args.data.name,
      group: args.data.group,
      excludeFromReport: args.data.excludeFromReport,
      onlyHours: args.data.onlyHours,
      onlyGroups: args.data.onlyGroups,
      parentId: args.data.parentId,
    },
  });
};

const deleteCourse = async (parent, args, context, info) => {
  await context.prisma.course.delete({
    where: {
      id: args.id,
    },
  });
};

const createCourse = async (parent, args, context, info) => {
  await context.prisma.course.create({
    data: {
      name: args.data.name,
      group: args.data.group,
      excludeFromReport: args.data.excludeFromReport,
      onlyHours: args.data.onlyHours,
      onlyGroups: args.data.onlyGroups,
      parentId: args.data.parentId,
    },
  });
};

module.exports = {
  updateCourse,
  createCourse,
  deleteCourse
}