import {Period as Quarter} from '@prisma/client';
import {AcademicPeriod, Month} from '../../@types/academicDate';

export interface Mark {
  id: number;
  value: string;
  date: Date;
}

export interface QuarterMark extends Omit<Mark, 'date'> {
  period: Quarter;
}

export interface IndividualJournalEntry {
  id: number;
  studentName: string;
  studentClass: string;
  marks: Mark[];
  quarterMarks: QuarterMark[];
}

export interface Group {
  dates: Record<Month, Set<Date>>
  students: {
    id: number;
    studentName: string;
    marks: Record<Month, Mark[]>;
    quarterMarks: QuarterMark[];
  }[]
}

export interface GroupJournalEntry {
  subgroup: string;
  months: {
    month: string,
    dates: Date[]
  }[]
  students: {
    id: number;
    studentName: string;
    marksByMonth: {
      month: string;
      marks: Mark[];
    }[]
    quarterMarks: QuarterMark[];
  }[]
}


export interface FetchJournalPayload {
  course: number;
  year: number;
  dateGte: string;
  dateLte: string;
}

export interface FetchGroupJournalPayload {
  course: number;
  year: number;
  period: AcademicPeriod;
  dateGte: string;
  dateLte: string;
}

export interface FetchTeacherStudentsPayload {
  year: number;
}

export interface MarkInput extends Mark {
  relationId: number;
}