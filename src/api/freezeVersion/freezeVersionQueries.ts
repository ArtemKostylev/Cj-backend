import { Resolver } from "../../@types/resolvers";

export const fetchFreezeVersions: Resolver<any> = async (parent, args, context) => {
  return await context.prisma.freezeVersion.findMany();
};