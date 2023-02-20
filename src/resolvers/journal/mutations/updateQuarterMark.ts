import {Resolver} from '../../../@types/resolver';
import {QuarterMark, QuarterMarkInput} from '../types';
import {upsertQuarterMark} from '../../../repository/journalRepository';

export const updateQuarterMark: Resolver<QuarterMarkInput, QuarterMark> = async (_, {id, value, period, relationId, year}, {user}) => {
  const mark = await upsertQuarterMark(id, relationId, value, period, year);

  return {
    id: mark.id,
    value: mark.mark,
    period: mark.period,
  }
}
