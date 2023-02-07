import {Request} from 'express';
import {PrismaClient, User} from '@prisma/client';

const jwt = require('jsonwebtoken');
const {NotAuthenticatedError} = require('./errors/authErrors');
const {RequestFailureError} = require('./errors/sharedErrors');

// TODO: use moment instead of manual parsing
const getMonthFromUTCString = (date: string) => {
  return date.split('T')[0].split('-')[1];
};

const getUserInfo = async (req: Request, prisma: PrismaClient): Promise<User> => {
  const header = req?.headers?.authorization;
  if (!header) throw new RequestFailureError('auth');

  const token = header.replace('Bearer ', '');
  const {userId} = jwt.verify(token, process.env.APP_SECRET);
  const user = await prisma.user.findUnique(userId);

  if (!user) throw new NotAuthenticatedError();

  return user;
};

module.exports = {
  getUserInfo,
  getMonthFromUTCString,
};
