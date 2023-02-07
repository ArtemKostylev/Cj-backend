export enum AcademicPeriod {
  FIRST,
  SECOND
}

export enum Month {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER
}

export const SECOND_PERIOD_MONTHS = [Month.JANUARY, Month.FEBRUARY, Month.MARCH, Month.APRIL, Month.MAY];
export const FIRST_PERIOD_MONTHS = [Month.SEPTEMBER, Month.OCTOBER, Month.NOVEMBER, Month.DECEMBER];

export const MONTHS_IN_PERIODS = {
  [AcademicPeriod.FIRST]: FIRST_PERIOD_MONTHS,
  [AcademicPeriod.SECOND]: SECOND_PERIOD_MONTHS
};