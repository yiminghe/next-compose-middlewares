import {
  NextContext,
  NextFunction,
  withLayoutMiddlewares,
  withPageMiddlewares,
  withActionMiddlewares,
  withRouteMiddlewares,
} from 'next-compose-middlewares';

async function user(context: NextContext, next: NextFunction) {
  context.user ??= 'test';
  return await next();
}

export const createPage = withPageMiddlewares([user]);
export const createLayout = withLayoutMiddlewares([user]);
export const createAction = withActionMiddlewares([user]);
export const createRoute = withRouteMiddlewares([user]);
