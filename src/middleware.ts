import { createMiddleware } from '@/next-compose-middlewares/middleware';

declare module '@/next-compose-middlewares/middleware' {
  export interface HeaderContext {
    foo?: string;
  }
}

export const middleware = createMiddleware([
  {
    header: async (context, next) => {
      context.foo = 'bar';
      console.log('header middleware', Date.now(), context.req.url);
      await next();
    },
    response: async (context, next) => {
      console.log(
        'response middleware',
        Date.now(),
        context.req.url,
        context.foo,
      );
      await next();
    },
  },
]);

export const config = {
  matcher: '/((?!_next|favicon.ico|sitemap.xml|robots.txt).*)',
};
