const updateStudent = async (parent, args, context, info) => {
    return await context.prisma.student.update({
        where: {
            id: args.data.id,
        },
        data: {
            name: args.data.name,
            surname: args.data.surname,
            class: args.data.class,
            program: args.data.program,
            specializationId: args.data.specializationId
        },
    });
};

const deleteStudent = async (parent, args, context, info) => {
    await context.prisma.student.delete({
        where: {
            id: args.id,
        },
    });
};

const createStudent = async (parent, args, context, info) => {
    await context.prisma.student.create({
        data: {
            name: args.data.name,
            surname: args.data.surname,
            class: parseInt(args.data.class),
            program: args.data.program,
        },
    });
};

module.exports = {
    updateStudent,
    deleteStudent,
    createStudent
}