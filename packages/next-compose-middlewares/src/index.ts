import type { NextContext, MiddlewareFunction, NextFunction } from './types';
import type { NextRequest } from 'next/server';
import { compose } from './compose';
import { createFinishMiddleware } from './finish';
import {
  getNextContextFromAction,
  getNextContextFromPage,
  getNextContextFromRoute,
} from './next-context';
import { setPageContext, runInRouteContext } from './set-context';
import { aborted } from 'util';

export type { ClientCookies, CookieOptions } from './types';
export type { NextContext, MiddlewareFunction, NextFunction };
export { getNextContext, createNextContext } from './set-context';
/**
 *@public
 */
const finishMiddleware = createFinishMiddleware();

function noop() {}

type PK = Record<string, string | string[]>;

type PageRequest = {
  params: PK;
  searchParams: PK;
};

type PageFn = (r: PageRequest) => void;

/**
 *@public
 */
export function createPage(fns: MiddlewareFunction[], Page: PageFn): PageFn {
  const handle = compose([
    finishMiddleware,
    ...fns,
    (_: any, _2: any, r: PageRequest) => Page(r),
  ]);
  const P = (r: PageRequest) => {
    const context = getNextContextFromPage();
    if (r?.params) {
      context.req.params = r.params;
    }
    return setPageContext(context, () => handle(context, noop, r));
  };
  if (Page.name) {
    Object.defineProperty(P, 'name', {
      writable: true,
      value: Page.name,
    });
  }
  return P;
}

type RouteFn = (request: NextRequest, context: { params: PK }) => void;

/**
 *@public
 */
export function createRoute(
  fns: MiddlewareFunction[],
  Route: RouteFn,
): RouteFn {
  const handle = compose([
    finishMiddleware,
    ...fns,
    (_: any, _2: any, ...args: any) => Route.apply(null, args),
  ]);
  const R = (...args: any) => {
    const r = args[0];
    const c = args[1];
    const context = getNextContextFromRoute(r);
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
}

/**
 *@public
 */
export function createAction<T extends Function>(
  fns: MiddlewareFunction[],
  action: T,
): T {
  //@ts-ignore
  const handle = compose([
    finishMiddleware,
    ...fns,
    (context: any, next: any, ...args: any) => action(...args),
  ]);
  const a = (...args: any) => {
    const context = getNextContextFromAction();
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
}
