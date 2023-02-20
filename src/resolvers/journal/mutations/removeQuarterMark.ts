import {Resolver} from '../../../@types/resolver';
import {deleteQuarterMark} from '../../../repository/journalRepository';
import {QuarterMark} from '../types';

export const removeQuarterMark: Resolver<number, QuarterMark> = async (_, id) => {
  const deletedEntry = await deleteQuarterMark(id);
  return {
    id: deletedEntry.id,
    value: deletedEntry.mark,
    period: deletedEntry.period
  }
}