const merge = require("lodash.merge");
const path = require("path");
const { GraphQLUpload } = require("graphql-upload");
const GraphQLDateTime = require("graphql-iso-date");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs } = require("@graphql-tools/merge");

const uploadResolvers = require("./api/uploads");
const accompanyResolvers = require("./api/accompany");
const adminResolvers = require("./api/admin");
const authResolvers = require("./api/auth");
const consultResolvers = require("./api/consult");
const courseResolvers = require("./api/course");
const journalResolvers = require("./api/journal");
const noteResolvers = require("./api/notes");
const replacementResolvers = require("./api/replacement");
const specializationResolvers = require("./api/specialization");
const studentResolvers = require("./api/student");
const subgroupResolvers = require("./api/subgroup");
const teacherResolvers = require("./api/teacher");
const freezeVersionResolvers = require("./api/freezeVersion");

const resolvers = merge(
  uploadResolvers,
  teacherResolvers,
  subgroupResolvers,
  studentResolvers,
  replacementResolvers,
  noteResolvers,
  journalResolvers,
  courseResolvers,
  consultResolvers,
  authResolvers,
  adminResolvers,
  accompanyResolvers,
  specializationResolvers,
  freezeVersionResolvers,
  {
    Date: GraphQLDateTime,
    Upload: GraphQLUpload
  }
);

const typesArray = loadFilesSync(path.join(__dirname, "."), {
  recursive: true,
  extensions: ["graphql"]
});

const createApolloServerProps = () => {
  return {
    resolvers: resolvers.resolvers,
    typeDefs: mergeTypeDefs(typesArray)
  };
};

module.exports = { createApolloServerProps };
