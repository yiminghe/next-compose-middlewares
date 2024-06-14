import { NextContext, NextFunction } from 'next-compose-middlewares';

export async function user(context: NextContext, next?: NextFunction) {
  context.user = 'test';
  return await next?.();
}
