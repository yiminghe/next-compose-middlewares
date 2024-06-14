import type {
  NextContext,
  MiddlewareFunction,
  NextFunction,
  PageRequest,
  RouteRequest,
} from './types';
import type { NextRequest } from 'next/server';
import { compose } from './compose';
import { createFinishMiddleware } from './finish';
import {
  getNextContextFromPage,
  getNextContextFromRoute,
} from './next-context';
import { setPageContext, asyncLocalStorage } from './set-context';

export { middleware } from './middleware';
export { createFinishMiddleware } from './finish';
export { compose } from './compose';
export type { ClientCookies, CookieOptions, PageRequest } from './types';
export type { NextContext, MiddlewareFunction, NextFunction };
export {
  getNextContext,
  createPageContext,
} from './set-context';
/**
 *@public
 */
export const finishMiddleware = createFinishMiddleware();

/**
 *@public
 */
export interface createPageProps {
  req?: () => PageRequest;
  name?: string;
}
/**
 *@public
 */
export interface createRouteProps {
  req?: (r: NextRequest) => RouteRequest;
  name?: string;
}
/**
 *@public
 */
export function createPage(
  fns: MiddlewareFunction[],
  props: createPageProps = {},
) {
  const handle = compose([finishMiddleware, ...fns]);
  const Page = () => {
    const context = getNextContextFromPage(props.req?.());
    setPageContext(context);
    return handle(context);
  };
  if (props.name) {
    Page.name = props.name;
  }
  return Page;
}

/**
 *@public
 */
export function createRoute(
  fns: MiddlewareFunction[],
  props: createRouteProps = {},
) {
  const handle = compose([finishMiddleware, ...fns]);
  const Route = (r: NextRequest) => {
    const context = getNextContextFromRoute(r, props.req?.(r));
    return asyncLocalStorage.run(context, () => handle(context));
  };
  if (props.name) {
    Route.name = props.name;
  }
  return Route;
}
