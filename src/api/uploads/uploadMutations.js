const uploadTeachersFromFile = async (_, args, context, info) => {
  const { createReadStream, filetype, mimetype, encoding } = await args.file;

  const stream = createReadStream();

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  let lines = [];

  for await (const line of rl) {
    const data = line.split(" ");
    if (data.length !== 3) throw new Error("Invalid file format");
    lines.push(data);
  }

  const currentEntries = await context.prisma.teacher.findMany({
    where: {
      FreezeVersion: null
    }
  });

  const created = lines.map(async (entry) => {
    if (
      -1 ===
      currentEntries.findIndex(
        (item) =>
          item.name === entry[0] &&
          item.surname === entry[1] &&
          item.parent === entry[2]
      )
    ) {
      await context.prisma.teacher.create({
        data: {
          name: entry[1],
          surname: entry[0],
          parent: entry[2] || ""
        }
      });
    }
  });

  return true;
};

const uploadCoursesFromFile = async (_, args, context, info) => {
  const { createReadStream } = await args.file;

  const stream = createReadStream();

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  let lines = [];

  for await (const line of rl) {
    const data = line.split(" ");
    if (data.length !== 2) throw new Error("Invalid file format");
    lines.push(data);
  }

  const currentEntries = await context.prisma.course.findMany({
    where: {
      FreezeVersion: null
    }
  });

  lines.map(async (entry) => {
    if (-1 === currentEntries.findIndex((item) => item.name === entry[0])) {
      await context.prisma.course.create({
        data: {
          name: entry[0],
          group: entry[1] === "+" ? true : false
        }
      });
    }
  });

  return true;
};

const uploadStudentsFromFile = async (_, args, context, info) => {
  const { createReadStream, filetype, mimetype, encoding } = await args.file;

  const stream = createReadStream();

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  let lines = [];

  for await (const line of rl) {
    const data = line.split(" ");
    if (data.length !== 4) throw new Error("Invalid file format");
    lines.push(data);
  }

  const currentEntries = await context.prisma.student.findMany({
    where: {
      FreezeVersion: null
    }
  });

  const created = lines.map(async (entry) => {
    if (
      -1 ===
      currentEntries.findIndex(
        (item) => item.name === entry[0] && item.surname === entry[1]
      )
    ) {
      await context.prisma.student.create({
        data: {
          name: entry[1],
          surname: entry[0],
          class: parseInt(entry[2]),
          program: entry[3]
        }
      });
    }
  });

  return true;
};

module.exports = {
  uploadTeachersFromFile,
  uploadStudentsFromFile,
  uploadCoursesFromFile
};
