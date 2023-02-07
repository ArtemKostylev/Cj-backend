import moment from 'moment';
import {Resolver} from '../../@types/resolver';
import {Month} from '../../@types/academicDate';
import {PROGRAMS} from '../../const/programs';
import {PrismaClient, Period as Quarter, Student} from '@prisma/client';
import {
  FetchGroupJournalPayload,
  FetchJournalPayload,
  FetchTeacherStudentsPayload,
  Group,
  GroupJournalEntry,
  IndividualJournalEntry,
  Mark
} from './types';
import {createEmptyGroup, getQuarterForDates, getQuarterForPeriods} from './utils';

const {getFreezeVersion} = require('../../queryUtils/getFreezeVersion');

const getJournalEntries = async (prisma: PrismaClient, user: number, course: number, year: number, dateGte: string, dateLte: string, quarters: Quarter[]) => {
  const freezeVersion = await getFreezeVersion(year, prisma);

  const teacher = await prisma.teacher.findFirstOrThrow({
    where: {
      userId: user,
      freezeVersionId: freezeVersion
    }
  })

  return await prisma.teacher_Course_Student.findMany({
    where: {
      teacherId: teacher.id,
      courseId: course,
      archived: false,
      freezeVersionId: freezeVersion
    },
    include: {
      journalEntry: {
        orderBy: {
          date: "asc",
        },
        where: {
          date: {
            gte: dateGte,
            lte: dateLte,
          },
        },
      },
      quaterMark: {
        where: {
          period: {
            in: quarters
          },
          year: year
        }
      },
      student: true,
    },
  });
}


const fetchIndividualJournal: Resolver<FetchJournalPayload, IndividualJournalEntry[]> = async (_, {course, year, dateGte, dateLte}, {
  user,
  prisma
}) => {
  const quarters = getQuarterForDates(moment(dateGte));

  const entries = await getJournalEntries(prisma, user.id, course, year, dateGte, dateLte, quarters);

  return entries?.map(entry => {
    if (!entry.student) throw new Error();
    const studentName = `${entry.student.surname || ''} ${entry.student.name || ''}`;
    const studentClass = `${entry.student.class || ''} ${PROGRAMS[entry.student.program || ''] || ''}`;

    const marks = entry.journalEntry.map(it => ({
      id: it.id,
      value: it.mark,
      date: it.date
    }));

    const quarterMarks = entry.quaterMark.map(it => ({
      id: it.id,
      period: it.period,
      value: it.mark
    }));

    return {
      studentName,
      studentClass,
      marks,
      quarterMarks,
    }
  })
};

const fetchGroupJournal: Resolver<FetchGroupJournalPayload, GroupJournalEntry[]> = async (_, {course, year, period, dateGte, dateLte}, {
  user,
  prisma
}) => {
  const quarters = getQuarterForPeriods(period);

  const entries = await getJournalEntries(prisma, user.id, course, year, dateGte, dateLte, quarters);

  const groups = {} as Record<string, Group>;

  entries.forEach(entry => {
    const student = entry.student;
    const key = `${student?.class} ${student?.program} ${entry.subgroup}`;

    const group: Group = groups[key] || createEmptyGroup(period);
    const studentJournalEntries = {} as Record<Month, Mark[]>;
    entry.journalEntry.forEach(mark => {
      const month = moment(mark.date).month() as Month;

      group.dates[month].add(mark.date)
      const monthMarks = studentJournalEntries[month] || [];
      monthMarks.push({
        date: mark.date,
        value: mark.mark,
        id: mark.id
      })

      studentJournalEntries[month] = monthMarks;
    });

    const studentEntry = {
      studentName: `${student?.surname} ${student?.name}`,
      marks: studentJournalEntries,
      quarterMarks: entry.quaterMark.map(it => ({
        id: it.id,
        period: it.period,
        value: it.mark
      }))
    }

    group.students.push(studentEntry);
    groups[key] = group;
  });

  return Object.entries(groups).map(([key, value]) => {
    const months = [] as { month: string, dates: Date[] }[];

    Object.entries(value.dates).forEach(([key, value]) => {
      months.push({month: key, dates: Array.from(value)});
    })

    return {
      subgroup: key,
      months,
      students: value.students.map(student => {
        const marksByMonth = [] as { month: string, marks: Mark[] }[];

        Object.entries(student.marks).forEach(([key, value]) => {
          marksByMonth.push({month: key, marks: value});
        })

        return {
          studentName: student.studentName,
          marksByMonth,
          quarterMarks: student.quarterMarks
        }
      })
    }
  });
}

const fetchTeacherStudents: Resolver<FetchTeacherStudentsPayload, (Student | null)[]> = async (parent, {year}, {prisma, user}) => {

  const freezeVersion = await getFreezeVersion(year, prisma);

  const teacher = await prisma.teacher.findFirstOrThrow({
    where: {
      userId: user.id,
      freezeVersionId: freezeVersion
    }
  })

  const data = await prisma.teacher_Course_Student.findMany({
    where: {
      teacherId: teacher.id,
      freezeVersionId: freezeVersion
    },
    select: {
      student: true
    }
  });

  return data.map(it => it.student);
}

module.exports = {
  fetchIndividualJournal,
  fetchGroupJournal,
  fetchTeacherStudents
}