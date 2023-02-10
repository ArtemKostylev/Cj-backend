import {Resolver} from '../../../@types/resolver';
import {Mark, MarkInput} from '../types';
import {upsertMark} from '../../../repository/journalRepository';

export const updateMark: Resolver<MarkInput, Mark> = async (_, {id, value, date, relationId}, {user}) => {
  const updatedEntry = await upsertMark(id, relationId, value, date);

  return updatedEntry.journalEntry
}
