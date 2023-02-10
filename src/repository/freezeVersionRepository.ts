import {prisma} from '../helpers/prisma';

export const getFreezeVersion = async (year: number) => {
  const freezeVersion = await prisma.freezeVersion.findFirst({
    where: {
      year
    }
  });

  return freezeVersion?.id || null;
}