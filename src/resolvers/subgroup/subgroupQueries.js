const {buildGroups} = require('../../utils');

const fetchSubgroups = async (parent, args, context) => {
    const {userId} = context;
    let students = await context.prisma.teacher_Course_Student.findMany({
        where: {
            teacherId: args.teacherId,
            courseId: args.courseId,
            archived: false,
            freezeVersionId: null
        },
        include: {
            student: true,
        },
    });

    let groups = [];
    let classes = [];
    let programs = [];
    let subgroups = [];
    let groupedData = [];

    students.forEach((item) => {
        classes.push(item.student.class);
        programs.push(item.student.program);
    });

    classes = [...new Set(classes)];
    programs = [...new Set(programs)];

    classes.forEach((num) => {
        programs.forEach((program) => {
            groups.push({
                class: num,
                program: program,
                relations: [],
            });
        });
    });

    students.forEach((item) => {
        let index = groups.findIndex(
            (group) =>
                item.student.class === group.class &&
                item.student.program === group.program
        );
        groups[index].relations.push(item);
    });

    groups.forEach((group) => {
        if (group.relations.length > 0) groupedData.push(group);
    });

    return groupedData;
};

module.exports = {
    fetchSubgroups,
};
