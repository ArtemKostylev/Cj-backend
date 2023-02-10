import {Resolver} from '../../@types/resolver';
import {getFreezeVersion} from '../../queryUtils/getFreezeVersion';

type FetchArgs = {
  teacherId: number;
  year: number;
  typeId: number;
  dateGte: string;
  dateLte: string;
}

const fetchMidtermExams: Resolver<FetchArgs> = async (_, {teacherId, year, dateLte, dateGte, typeId}, {prisma}) => {
  const freezeVersion = await getFreezeVersion(year, prisma);

  return await prisma.midtermExam.findMany({
    where: {
      freezeVersionId: freezeVersion,
      teacherId,
      deleted: false,
      typeId,
      date: {
        gte: dateGte,
        lte: dateLte
      }
    },
    orderBy: {
      number: 'asc'
    },
    include: {
      student: true,
      type: true
    }
  })
}

const fetchMidtermExamTypes: Resolver<any> = async (_, args, {prisma}) => {
  return await prisma.midtermExamType.findMany({
    where: {
      deleted: false
    }
  })
}

module.exports = {fetchMidtermExams, fetchMidtermExamTypes};