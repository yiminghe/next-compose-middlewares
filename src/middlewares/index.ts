import { getI18n } from '@/i18n/server';
import { getI18nComponent, I18nTranslate } from '@/i18n/types';
import {
  NextContext,
  NextFunction,
  withLayoutMiddlewares,
  withPageMiddlewares,
  withActionMiddlewares,
  withRouteMiddlewares,
} from '@/next-compose-middlewares';

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
    const { i18n, c, translation } = getI18n(locale);
    context.t = i18n.t as I18nTranslate;
    context.c = c;
    context.translation = translation;
    context.locale = locale;
  },
]);
export const createLayout = withLayoutMiddlewares([user]);
export const createAction = withActionMiddlewares([user]);
export const createRoute = withRouteMiddlewares([user]);
