const {getFreezeVersion} = require('../../queryUtils/getFreezeVersion');
const fetchGroupConsults = async (parent, args, context) => {
    const {userId} = context;

    const freezeVersion = await getFreezeVersion(args.year, context.prisma);

    let availableGroups = await context.prisma.teacher_Course_Student.findMany(
        {
            where: {
                teacherId: args.teacherId,
                courseId: args.courseId,
                archived: false,
                freezeVersionId: freezeVersion
            },
            select: {
                subgroup: true,
                student: {
                    select: {
                        class: true,
                        program: true,
                    },
                },
            },
        }
    );

    availableGroups = new Set(availableGroups.map((item) => `${item.student.class} ${item.student.program} ${item.subgroup || "..."}`));

    const consultsAll = await context.prisma.groupConsult.findMany({
        where: {
            teacherId: args.teacherId,
            courseId: args.courseId,
            year: args.year,
        },
    });

    let consultsByGroups = new Map();

    consultsAll.forEach((item) => {
        const key = `${item.class} ${item.program} ${item.subgroup || "..."}`;

        const value = {
            id: item.id,
            date: item.date,
            hours: item.hours,
        };

    if (consultsByGroups.has(key)) {
      consultsByGroups.set(key, [...consultsByGroups.get(key), value]);
    } else {
      consultsByGroups.set(key, [value]);
    }
  });

    return Array.from(availableGroups).map((group) => {
        if (consultsByGroups.has(group))
            return {group, consult: consultsByGroups.get(group)};
        return {group, consult: []};
    });
};

const fetchConsults = async (parent, args, context) => {
    const {userId} = context;

    const freezeVersion = await getFreezeVersion(args.year, context.prisma);

    return await context.prisma.teacher_Course_Student.findMany({
        where: {
            teacherId: args.teacherId,
            courseId: args.courseId,
            freezeVersionId: freezeVersion,
            archived: false
        },
        include: {
            consult: {
                orderBy: {
                    date: "asc",
                },
                where: {
                    year: args.year,
                },
            },
            student: true,
        },
    });
};

module.exports = {
    fetchConsults,
    fetchGroupConsults
}
