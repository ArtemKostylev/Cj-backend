const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user
  };
};

const signin = async (parent, args, context, info) => {
  const user = await context.prisma.user.findUnique({
    where: { login: args.login },
    include: {
      teacher: {
        include: {
          relations: {
            where: {
              FreezeVersionId: null
            },
            distinct: ["courseId"],
            select: {
              course: true
            }
          }
        }
      },
      role: true
    }
  });

  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

  return {
    token,
    user
  };
};

module.exports = {
  signup,
  signin
};
