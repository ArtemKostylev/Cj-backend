const {NOT_FREEZED} = require('../../queires');
const fetchStudents = async (parent, args, context) => {
    const {userId} = context;
    return await context.prisma.student.findMany(NOT_FREEZED);
};

module.exports = {
    fetchStudents
}