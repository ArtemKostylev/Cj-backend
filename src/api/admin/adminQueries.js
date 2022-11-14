const fs = require("fs");
const htmlDocx = require("html-docx-js");
const { buildHtml } = require("../../helpers/htmlBuilder");

const fetchFullInfo = async (parent, args, context) => {
  const { userId } = context;
  const teachers = await context.prisma.teacher.findMany({
    where: {
      FreezeVersion: null
    }
  });
  const students = await context.prisma.student.findMany({
    where: {
      FreezeVersion: null
    },
    include: {
      specialization: true
    }
  });
  const courses = await context.prisma.course.findMany({
    where: {
      FreezeVersion: null
    }
  });
  const specializations = await context.prisma.specialization.findMany({
    where: {
      FreezeVersion: null
    }
  });
  const relations = await context.prisma.teacher_Course_Student.findMany({
    where: {
      FreezeVersion: null
    },
    include: {
      teacher: true,
      student: true,
      course: true
    }
  });
  return {
    teachers,
    students,
    courses,
    relations,
    specializations
  };
};

const fetchAnnualReport = async (parent, args, context) => {
  const data = await context.prisma.teacher_Course_Student.findMany({
    where: {
      archived: false,
      course: {
        excludeFromReport: false
      },
      FreezeVersion: null
    },
    select: {
      quaterMark: {
        where: {
          year: args.year
        }
      },
      student: {
        include: {
          specialization: true
        }
      },
      course: true
    }
  });

  const mappedData = new Map();

  data.forEach((item) => {
    const key = `${item.student.class}/${
      item.student.specialization?.name || null
    }/${item.student.program === "OP" ? "OP" : "PP"}`;

    mappedData.set(
      key,
      mappedData.get(key) ? [...mappedData.get(key), item] : [item]
    );
  });

  mappedData.forEach((value, key) => {
    let courses = new Map();

    value.forEach((it) => courses.set(it.course.id, it.course.name));

    courses = Array.from(courses, ([name, value]) => ({
      id: name,
      name: value
    }));

    const studentMarks = new Map();

    value.forEach((it) => {
      const key = `${it.student.name} ${it.student.surname}`;
      studentMarks.set(
        key,
        studentMarks.get(key)
          ? [
            ...studentMarks.get(key),
            { courseId: it.course.id, marks: it.quaterMark }
          ]
          : [{ courseId: it.course.id, marks: it.quaterMark }]
      );
    });

    mappedData.set(key, { courses, studentMarks });
  });

  const doc = buildHtml(mappedData);

  await fs.writeFile("vedomost.html", doc, function(err) {
    if (err) throw err;
    console.log("HTML builded");
  });

  /*   const docx = htmlDocx.asBlob(doc, { orientation: 'landscape' });

  fs.writeFile(
    `/var/www/files/vedomost_${args.year}.docx`,
    docx,
    function (err) {
      if (err) throw err;
    }
  );

  return `https://akostylev.com/files/vedomost_${args.year}.docx`; */
};

module.exports = {
  fetchFullInfo,
  fetchAnnualReport
};
