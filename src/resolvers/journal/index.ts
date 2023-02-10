import {fetchTeacherStudents} from './queries/fetchTeacherStudents';
import {fetchIndividualJournal} from './queries/fetchIndividualJournal';
import {fetchGroupJournal} from './queries/fetchGroupJpurnal';

const Mutation = require('./journalMutations');

module.exports = {
  resolvers: {
    Query: {
      fetchIndividualJournal,
      fetchTeacherStudents,
      fetchGroupJournal
    }, Mutation
  }
};
