const {NOT_FREEZED} = require('../../queires');
const fetchCourses = async (parent, args, context) => {
    const {userId} = context;
    return await context.prisma.course.findMany(NOT_FREEZED);
};

module.exports = {fetchCourses}