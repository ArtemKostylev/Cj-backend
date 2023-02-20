import {Resolver} from '../../../@types/resolver';
import {deleteMark} from '../../../repository/journalRepository';
import {Mark} from '../types';

export const removeMark: Resolver<number, Mark> = async (_, id) => {
  const deletedEntry = await deleteMark(id);
  return {
    id: deletedEntry.id,
    value: deletedEntry.mark,
    date: deletedEntry.date
  }
}