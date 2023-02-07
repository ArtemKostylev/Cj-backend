import {Moment} from 'moment';
import {Period as Quarter} from '@prisma/client';
import {AcademicPeriod, Month, MONTHS_IN_PERIODS} from '../../@types/academicDate';

export const getQuarterForDates = (date: Moment): Quarter[] => {
  switch (date.month()) {
    case Month.OCTOBER:
      return [Quarter.first];
    case Month.DECEMBER:
      return [Quarter.second];
    case Month.MARCH:
      return [Quarter.third];
    case Month.MAY:
      return [Quarter.fourth, Quarter.year];
    default:
      return [];
  }
}

export const getQuarterForPeriods = (period: AcademicPeriod): Quarter[] => {
  switch (period) {
    case AcademicPeriod.FIRST:
      return [Quarter.third, Quarter.fourth, Quarter.year];
    case AcademicPeriod.SECOND:
      return [Quarter.first, Quarter.second];
    default:
      return [];
  }
}

export const createEmptyGroup = (period: AcademicPeriod) => {
  return {
    dates: MONTHS_IN_PERIODS[period].map(it => [it, new Set()]),
    students: []
  }
}