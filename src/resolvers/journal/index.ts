import {fetchTeacherStudents} from './queries/fetchTeacherStudents';
import {fetchIndividualJournal} from './queries/fetchIndividualJournal';
import {fetchGroupJournal} from './queries/fetchGroupJpurnal';
import {updateMark} from './mutations/updateMark';
import {updateQuarterMark} from './mutations/updateQuarterMark';
import {removeMark} from './mutations/removeMark';
import {removeQuarterMark} from './mutations/removeQuarterMark';

module.exports = {
  resolvers: {
    Query: {
      fetchIndividualJournal,
      fetchTeacherStudents,
      fetchGroupJournal
    },
    Mutation: {
      updateMark,
      updateQuarterMark,
      removeMark,
      removeQuarterMark
    }
  }
};
