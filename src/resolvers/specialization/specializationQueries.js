const {NOT_FREEZED} = require('../../queires');
const fetchSpecialization = async (parent, args, context) => {
    const {userId} = context;
    return await context.prisma.specialization.findMany(NOT_FREEZED);
};

module.exports = {
    fetchSpecialization,
};
