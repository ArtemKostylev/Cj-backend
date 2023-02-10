const updateSpecialization = async (parent, args, context, info) => {
  await context.prisma.specialization.upsert({
    where: {
      id: args.data.id,
    },
    update: {
      name: args.data.name,
    },
    create: {
      name: args.data.name,
    },
  });

  return true;
};

const deleteSpecialization = async (parent, args, context, info) => {
  await context.prisma.specialization.delete({
    where: {
      id: args.id,
    },
  });

  return true;
};

module.exports = {
  updateSpecialization,
  deleteSpecialization,
};
