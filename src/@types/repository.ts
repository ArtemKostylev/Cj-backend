import {PrismaClient} from '@prisma/client';

export interface RepoMethodParams {
  prisma: PrismaClient
}

export type RepoMethod<T extends RepoMethodParams, R> = (params: T) => Promise<R>;