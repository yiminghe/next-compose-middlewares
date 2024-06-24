import type { NextContext, MiddlewareFunction, NextFunction } from './types';
import type { NextRequest } from 'next/server';
import { compose } from './compose';
import { createFinishMiddleware } from './finish';
import {
  createNextContextFromAction,
  createNextContextFromPage,
  createNextContextFromRoute,
} from './next-context';
import {
  setPageContext,
  runInRouteContext,
  isPageContextInitialized,
  getPageContext,
} from './set-context';

export type { ClientCookies, CookieOptions } from './types';
export type { NextContext, MiddlewareFunction, NextFunction };
export { getNextContext, createNextContext } from './set-context';
/**
 *@public
 */
const finishMiddleware = createFinishMiddleware();

function noop() {}

/**
 *@public
 */
export type Params = Record<string, string | string[]>;

/**
 *@public
 */
export type PageRequest = {
  params: Params;
  searchParams: Params;
};
/**
 *@public
 */
export type ReturnedRender = void | React.ReactNode;
/**
 *@public
 */
export type PageFunction = (
  r: PageRequest,
) => ReturnedRender | Promise<ReturnedRender>;

/**
 *@public
 */
export function withPageMiddlewares(fns: MiddlewareFunction[]) {
  return function (Page: PageFunction): PageFunction {
    const handle = compose([
      finishMiddleware,
      ...fns,
      (_: any, _2: any, r: any) => Page(r),
    ]);
    const P = async (r: PageRequest | LayoutRequest) => {
      const currentType = 'children' in r ? 'layout' : 'page';
      // if page context is initialized by layout, use it, otherwise create a new one
      const context = isPageContextInitialized()
        ? getPageContext()
        : createNextContextFromPage(currentType);
      const prevType = context.type;
      context.type = currentType;
      if (r?.params) {
        context.req.params = r.params;
      }
      const ret = await setPageContext(context, () => handle(context, noop, r));
      context.type = prevType;
      return ret;
    };
    if (Page.name) {
      Object.defineProperty(P, 'name', {
        writable: true,
        value: Page.name,
      });
    }
    return P as PageFunction;
  };
}
/**
 *@public
 */
export type LayoutRequest = {
  params: Params;
  children: React.ReactNode;
};
/**
 *@public
 */
export type LayoutFunction = (
  r: LayoutRequest,
) => ReturnedRender | Promise<ReturnedRender>;

/**
 *@public
 */
export const withLayoutMiddlewares: (
  fns: MiddlewareFunction[],
) => (Layout: LayoutFunction) => LayoutFunction = withPageMiddlewares as any;

/**
 *@public
 */
export type RouteFunction = (
  request: NextRequest,
  context: { params: Params },
) => any;

/**
 *@public
 */
export function withRouteMiddlewares(fns: MiddlewareFunction[]) {
  return function (Route: RouteFunction): RouteFunction {
    const handle = compose([
      finishMiddleware,
      ...fns,
      (_: any, _2: any, ...args: any) => Route.apply(null, args),
    ]);
    const R = (...args: any) => {
      const r = args[0];
      const c = args[1];
      const context = createNextContextFromRoute(r);
      if (c?.params) {
        context.req.params = c.params;
      }
      return runInRouteContext(context, () => handle(context, noop, ...args));
    };
    if (Route.name) {
      Object.defineProperty(R, 'name', {
        writable: true,
        value: Route.name,
      });
    }
    return R;
  };
}

/**
 *@public
 */
export function withActionMiddlewares(fns: MiddlewareFunction[]) {
  return function <T extends Function>(action: T): T {
    //@ts-ignore
    const handle = compose([
      finishMiddleware,
      ...fns,
      (context: any, next: any, ...args: any) => action(...args),
    ]);
    const a = (...args: any) => {
      const context = createNextContextFromAction();
      //@ts-ignore
      return runInRouteContext(context, () => handle(context, noop, ...args));
    };
    if (action.name) {
      Object.defineProperty(a, 'name', {
        writable: true,
        value: action.name,
      });
    }
    return a as any;
  };
}
