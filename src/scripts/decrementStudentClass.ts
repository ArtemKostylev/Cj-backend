const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.student.updateMany({
  where: {
    FreezeVersion: null
  },
  data: {
    class: {
      increment: 1
    }
  }
}).then((res: any) => console.log(res));