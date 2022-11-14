import { Context } from "../index";
import { GraphQLResolveInfo } from "graphql";

export type Resolver<T> = (_: undefined, args: T, context: Context, info: GraphQLResolveInfo) => any;
