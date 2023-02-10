import {Resolver} from '../../../@types/resolver';
import {FetchJournalPayload, IndividualJournalEntry} from '../types';
import {getQuarterForDates} from '../utils';
import moment from 'moment';
import {getJournalEntries} from '../../../repository/journalRepository';

export const fetchIndividualJournal: Resolver<FetchJournalPayload,
  IndividualJournalEntry[]> = async (_, {course, year, dateGte, dateLte}, {user}) => {
  const quarters = getQuarterForDates(moment(dateGte));

  const entries = await getJournalEntries(
    user.id,
    course,
    year,
    dateGte,
    dateLte,
    quarters
  );

  return entries?.map(entry => {
    const student = entry.student;
    const studentName = `${student?.surname} ${student?.name}`;
    const studentClass = `${student?.class || ''} ${student?.program || ''}`;

    const marks = entry.journalEntry.map(it => ({
      id: it.id,
      value: it.mark,
      date: it.date
    }))

    const quarterMarks = entry.quaterMark.map(it => ({
      id: it.id,
      value: it.mark,
      period: it.period
    }))

    return {
      id: entry.id,
      studentName,
      studentClass,
      marks,
      quarterMarks
    }
  })
};