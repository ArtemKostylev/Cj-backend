import {Resolver} from '../../../@types/resolver';
import {FetchGroupJournalPayload, Group, GroupJournalEntry, Mark} from '../types';
import {createEmptyGroup, getQuarterForPeriods} from '../utils';
import {Month} from '../../../@types/academicDate';
import {JournalEntry, QuaterMark} from '@prisma/client';
import moment from 'moment';
import {getJournalEntries} from '../../../repository/journalRepository';

export const fetchGroupJournal: Resolver<FetchGroupJournalPayload,
  GroupJournalEntry[]> = async (_, {course, year, period, dateGte, dateLte}, {user}) => {
  const quarters = getQuarterForPeriods(period);
  const entries = await getJournalEntries(
    user.id,
    course,
    year,
    dateGte,
    dateLte,
    quarters
  );
  const groups = {} as Record<string, Group>;

  entries.forEach((entry) => {
    const student = entry.student;
    const key = `${student?.class || ''} ${student?.program || ''} ${entry.subgroup || ''}`;

    const group: Group = groups[key] || createEmptyGroup(period);
    const studentJournalEntries = {} as Record<Month, Mark[]>;
    entry.journalEntry.forEach((mark: JournalEntry) => {
      const month = moment(mark.date).month() as Month;

      group.dates[month].add(mark.date);
      const monthMarks = studentJournalEntries[month] || [];
      monthMarks.push({
        date: mark.date,
        value: mark.mark,
        id: mark.id,
      });

      studentJournalEntries[month] = monthMarks;
    });

    const studentEntry = {
      id: entry.id,
      studentName: `${student?.surname} ${student?.name}`,
      marks: studentJournalEntries,
      quarterMarks: entry.quaterMark.map((it: QuaterMark) => ({
        id: it.id,
        period: it.period,
        value: it.mark,
      })),
    };

    group.students.push(studentEntry);
    groups[key] = group;
  });

  return Object.entries(groups).map(([key, value]) => {
    const months = [] as { month: string; dates: Date[] }[];

    Object.entries(value.dates).forEach(([key, value]) => {
      months.push({month: key, dates: Array.from(value)});
    });

    return {
      subgroup: key,
      months,
      students: value.students.map((student) => {
        const marksByMonth = [] as { month: string; marks: Mark[] }[];

        Object.entries(student.marks).forEach(([key, value]) => {
          marksByMonth.push({month: key, marks: value});
        });

        return {
          id: student.id,
          studentName: student.studentName,
          marksByMonth,
          quarterMarks: student.quarterMarks,
        };
      }),
    };
  });
};
