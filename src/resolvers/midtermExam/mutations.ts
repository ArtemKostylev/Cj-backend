import {Resolver} from '../../@types/resolver';
import {MidtermExamInput, MidtermExamTypeInput} from './types';

type UpdateParams = {
  data: MidtermExamInput
}

type UpdateTypeParams = {
  data: MidtermExamTypeInput
}

const updateMidtermExam: Resolver<UpdateParams> = async (_, {data: {id, ...data}}, {prisma}) => {
  return await prisma.midtermExam.upsert({
    where: {
      id
    },
    update: {
      ...data
    },
    create: {
      ...data
    },
    include: {
      student: true,
      type: true
    }
  })
}

const deleteMidtermExam: Resolver<{ id: number }> = async (_, {id}, {prisma}) => {
  const deletedEntry = await prisma.midtermExam.update({
    where: {id},
    data: {
      deleted: true
    }
  });

  await prisma.midtermExam.updateMany({
    where: {
      number: {
        gte: deletedEntry.number
      }
    },
    data: {
      number: {
        decrement: 1
      }
    }
  });

  return deletedEntry;
}

const updateMidtermExamType: Resolver<UpdateTypeParams> = async (_, {data: {id, name}}, {prisma}) => {
  return await prisma.midtermExamType.upsert({
    where: {id},
    update: {name},
    create: {name}
  })
}

const deleteMidtermExamType: Resolver<{ id: number }> = async (_, {id}, {prisma}) => {
  return await prisma.midtermExamType.update({
    where: {id},
    data: {
      deleted: true
    }
  })
}

module.exports = {
  updateMidtermExam,
  deleteMidtermExam,
  updateMidtermExamType,
  deleteMidtermExamType
}