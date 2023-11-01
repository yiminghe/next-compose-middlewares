import { NextContext, NextFunction } from 'next-compose-middleware';

export { finishMiddleware } from 'next-compose-middleware';

export async function user(context: NextContext, next?: NextFunction) {
  context.user = 'test';
  await next?.();
}
