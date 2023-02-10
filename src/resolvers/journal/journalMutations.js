const updateJournal = async (parent, args, context, info) => {
    const {updateCasual, updatePeriod, deleteCasual, deletePeriod} = args.data;

    updateCasual.map(async (entry) => {
        return await context.prisma.journalEntry.upsert({
            where: {
                id: entry.id,
            },
            update: {
                mark: entry.mark,
                date: entry.date,
            },
            create: {
                mark: entry.mark,
                date: entry.date,
                relationId: entry.relationId,
            },
        });
    });

    let ids = deleteCasual.map((id) => parseInt(id));

    const deleteRepl = context.prisma.replacement.deleteMany({
        where: {
            entryId: {
                in: ids,
            },
        },
    });

    const deleteMark = context.prisma.journalEntry.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    await context.prisma.$transaction([deleteRepl, deleteMark]);

    updatePeriod.map(async (mark) => {
        return await context.prisma.quaterMark.upsert({
            where: {
                id: mark.id,
            },
            update: {
                mark: mark.mark,
            },
            create: {
                mark: mark.mark,
                period: mark.period,
                year: mark.year,
                relationId: mark.relationId,
            },
        });
    });

    let qids = deletePeriod.map((id) => parseInt(id));

    let res = await context.prisma.quaterMark.deleteMany({
        where: {
            id: {
                in: qids,
            },
        },
    });
};

module.exports = {updateJournal}