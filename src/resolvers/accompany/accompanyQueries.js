const fetchGroupCompany = async (parent, args, context) => {
  // args: teacherId, courseId
  // 1. Get corresponding course from DB
  const course = await context.prisma.course.findUnique({
    where: {
      id: args.courseId,
    },
    select: {
      parentId: true,
    },
  });
  // 2. Get all relations of corresponding course
  const relations = await context.prisma.teacher_Course_Student.findMany({
    where: {
      courseId: course.parentId,
    },
    select: {
      student: {
        select: {
          class: true,
          program: true,
        },
      },
      subgroup: true,
    },
  });
  // 3. Create groups from corr relations
  const groups = new Set(
    relations.map((item) => {
      return `${item.student.class} ${item.student.program} ${
        item.subgroup | "..."
      }`;
    })
  );
  // 4. Get all Hour data based on created groups
  const hours = await context.prisma.courseHours.findMany({
    where: {
      courseId: args.courseId,
      teacherId: args.teacherId,
    },
    select: {
      class: true,
      program: true,
      subgroup: true,
      date: true,
      hours: true,
    },
  });
  // 5. return Hour data
  const result = new Map();
  hours.forEach((item) => {
    const key = `${item.class} ${item.program} ${item.subgroup | "..."}`;
    const value = {
      id: item.id,
      date: item.date,
      hours: item.hours,
    };
    if (result.has(key)) {
      result.set(key, result.get(key).push(value));
    } else {
      result.set(key, [value]);
    }
  });

  return groups.map((group) => {
    if (result.has(group))
      return { group: group, hours: result.get(group) };
    return { group: group, hours: [] };
  });
}

module.exports = {
  fetchGroupCompany
}