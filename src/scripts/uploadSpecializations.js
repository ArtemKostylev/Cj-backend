const { PrismaClient } = require("@prisma/client");
fs = require("fs");
path = require("path");

const uploadSpecializations = async () => {
  const input = process.argv.slice(2)[0];

  const prisma = new PrismaClient();

  fs.readFile(path.join(__dirname, `./${input}`), "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    const list = data.split("\n");

    const studentsMap = new Map();

    let currentSpec = "";
    list.forEach((row) => {
      if (row.includes("spec")) {
        currentSpec = row.split(":")[1].toLowerCase().trim();
        return;
      }

      if (row.trim() === "") {
        return;
      }

      studentsMap.set(
        currentSpec,
        studentsMap.has(currentSpec)
          ? [...studentsMap.get(currentSpec), row.trim()]
          : [row.trim()]
      );
    });

    studentsMap.forEach(async (value, key) => {
      let spec = await prisma.specialization.findFirst({
        where: {
          name: key
        }
      });

      console.log(spec);

      if (!spec) {
        spec = await prisma.specialization.create({
          data: {
            name: key
          }
        });
      }

      value.forEach(async (it) => {
        await prisma.student.updateMany({
          where: {
            name: it.split(" ")[1],
            surname: it.split(" ")[0]
          },
          data: {
            specializationId: spec.id
          }
        });
      });
    });
    //process.exit();
  });

  // TODO: truncate and toLower spec names, also how to put conflicts?
};

uploadSpecializations();
