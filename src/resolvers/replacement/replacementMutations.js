const updateReplacements = async (parent, args, context, info) => {
    return await Promise.all(args.data.map((repl) => {
        return context.prisma.replacement.upsert({
            where: {
                id: repl.id,
            },
            update: {
                date: repl.date,
            },
            create: {
                date: repl.date,
                entryId: repl.entryId,
            },
        });
    }));
};

const deleteReplacements = async (parent, args, context, info) => {
    let ids = args.ids.map((id) => parseInt(id));

    let res = await context.prisma.replacement.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
};

module.exports = {
    updateReplacements,
    deleteReplacements
}