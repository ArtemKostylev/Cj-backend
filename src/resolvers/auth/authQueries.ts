const jwt = require('jsonwebtoken');

const updateUserInfo = async (parent: any, args: any, context: any) => {
  const {userId} = jwt.decode(args.token, process.env.APP_SECRET);
  const user = await context.prisma.user.findUnique({
    where: {id: userId},
    include: {
      teacher: {
        include: {
          relations: {
            distinct: ['courseId'],
            where: {
              archived: false
            },
            select: {
              course: true
            },
          },
          freezeVersion: {
            select: {
              year: true
            }
          }
        },
      },
      role: true,
    },
  });
  if (!user) {
    throw new Error('No such user found');
  }

  return {
    user,
    token: args.token
  };
}

module.exports = {
  updateUserInfo
}