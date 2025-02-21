import { getI18n } from '@/i18n/server';
import {
  NextContext,
  NextFunction,
  withLayoutMiddlewares,
  withPageMiddlewares,
  withActionMiddlewares,
  withRouteMiddlewares,
} from '@/next-context';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function user(context: NextContext, next: NextFunction) {
  console.log('begin run user middleware ' + Date.now());
  await sleep(500);
  context.user = 'test';
  console.log('end run user middleware ' + Date.now());
  await next();
}

export const createPage = withPageMiddlewares([
  user,
  async (context, next) => {
    const locale = (context.req.query.locale as any) || 'zh-CN';
    const { t, messages } = getI18n(locale);
    context.t = t;
    context.messages = messages;
    context.locale = locale;
  },
]);
export const createLayout = withLayoutMiddlewares([user]);
export const createAction = withActionMiddlewares([user]);
export const createRoute = withRouteMiddlewares([user]);
