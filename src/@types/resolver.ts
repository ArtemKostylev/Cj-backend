import {GraphQLResolveInfo} from "graphql";
import {Context} from '../index';

export type Resolver<T, R> = (_: undefined, args: T, context: Context, info: GraphQLResolveInfo) => Promise<R>;