import { NextContext, NextFunction } from 'next-compose-middlewares';

export async function user(context: NextContext, next?: NextFunction) {
  context.user = 'test';
  await next?.();
}
