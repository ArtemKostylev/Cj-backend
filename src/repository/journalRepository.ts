import {Period as Quarter} from '@prisma/client';
import {getFreezeVersion} from './freezeVersionRepository';
import {prisma} from '../helpers/prisma';

export const getJournalEntries = async (user: number, course: number, year: number, dateGte: string, dateLte: string, quarters: Quarter[]
) => {
  const freezeVersion = await getFreezeVersion(year);

  const teacher = await prisma.teacher.findFirstOrThrow({
    where: {
      userId: user,
      freezeVersionId: freezeVersion,
    },
  });

  return await prisma.teacher_Course_Student.findMany({
    where: {
      teacherId: teacher.id,
      courseId: course,
      archived: false,
      freezeVersionId: freezeVersion,
    },
    include: {
      journalEntry: {
        orderBy: {
          date: 'asc',
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
            in: quarters,
          },
          year: year,
        },
      },
      student: true,
    },
  });
};

export const getTeacherStudents = async (userId: number, freezeVersionId: number | null) => prisma.teacher.findMany({
  where: {
    userId,
    freezeVersionId,
  },
  select: {
    relations: {
      select: {student: true}
    }
  },
  distinct: ['id']
});

export const upsertMark = (id: number, relationId: number, value: string, date: Date) => prisma.teacher_Course_Student.update({
  where: {
    id: relationId
  },
  data: {
    journalEntry: {
      upsert: {
        where: {
          id
        },
        update: {
          mark: value,
          date: date
        },
        create: {
          mark: value,
          date: date
        }
      }
    }
  },
  include: {
    journalEntry: true
  }
})