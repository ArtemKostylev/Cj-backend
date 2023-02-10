const updateSubgroups = async (parent, args, context, info) => {
    const updatedEntries = await Promise.all(
        args.data.map((subgroup) =>
            context.prisma.teacher_Course_Student.update({
                where: {
                    id: subgroup.id,
                },
                data: {
                    subgroup: subgroup.subgroup,
                },
            })
        )
    );
};

module.exports = {
    updateSubgroups,
};
