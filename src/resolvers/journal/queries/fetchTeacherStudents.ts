import {Resolver} from '../../../@types/resolver';
import {FetchTeacherStudentsPayload} from '../types';
import {Student} from '@prisma/client';
import {getFreezeVersion} from '../../../repository/freezeVersionRepository';
import {getTeacherStudents} from '../../../repository/journalRepository';

export const fetchTeacherStudents: Resolver<FetchTeacherStudentsPayload, (Student | null)[]> = async (_, {year}, {user}) => {
  const freezeVersionId = await getFreezeVersion(year);

  const data = await getTeacherStudents(user.id, freezeVersionId);
  return data[0].relations.map(it => it.student);
};
