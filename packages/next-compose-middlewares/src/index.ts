import { NextContext, MiddlewareFunction, NextFunction } from './types';
import { NextRequest } from 'next/server';
import { cookies as getCookies, headers as getHeaders } from 'next/headers';
import { compose } from './compose';
import { createFinishMiddleware } from './finish';

export { middleware } from './middleware';
export { createFinishMiddleware } from './finish';
export { compose } from './compose';
export type { NextContext, MiddlewareFunction, NextFunction };
/**
 *@public
 */
export const finishMiddleware = createFinishMiddleware();

/**
 *@public
 */
export interface PageRequest {
  params?: any;
  method?: string;
  text?: () => Promise<string>;
  json?: () => Promise<any>;
}

/**
 *@public
 */
export interface RouteRequest {
  params?: any;
}
/**
 *@public
 */
export interface createPageProps {
  request?: () => PageRequest;
  name?: string;
}
/**
 *@public
 */
export interface createRouteProps {
  request?: (r: NextRequest) => RouteRequest;
  name?: string;
}
/**
 *@public
 */
export function createPage(
  fns: MiddlewareFunction[],
  props: createPageProps = {},
) {
  const handle = compose(fns);
  const Page = () => {
    return handle(getNextContextFromPage(props.request?.()));
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
  const handle = compose(fns);
  const Route = (r: NextRequest) => {
    return handle(getNextContextFromRoute(r, props.request?.(r)));
  };
  if (props.name) {
    Route.name = props.name;
  }
  return Route;
}

/**
 *@public
 */
export function getNextContextFromPage(props: PageRequest = {}) {
  const cookies = getCookies();
  const headers = getHeaders();
  const url = headers.get('x-url');
  if (!url) {
    throw new Error('must set x-url header from middleware');
  }
  const nextUrl = new URL(url);
  const searchParams: Record<string, any> = {};
  for (const [k, v] of Array.from(nextUrl.searchParams.entries())) {
    searchParams[k] = v;
  }
  const context: NextContext = {
    type: 'page',
    cookies,
    request: {
      url,
      text: () =>
        new Promise((r) => {
          r('');
        }),
      json: () =>
        new Promise((r) => {
          r({});
        }),
      headers,
      pathname: new URL(url).pathname,
      method: 'GET',
      searchParams,
      ...props,
    },
    response: {
      status: 200,
    },
  };
  return context;
}
/**
 *@public
 */
export function getNextContextFromRoute(
  request: NextRequest,
  props: RouteRequest = {},
) {
  const searchParams: Record<string, any> = {};
  for (const [k, v] of Array.from(request.nextUrl.searchParams.entries())) {
    searchParams[k] = v;
  }
  const cookies = getCookies();
  const headers = getHeaders();
  const context: NextContext = {
    type: 'route',
    cookies,
    response: {
      status: 200,
    },
    request: {
      url: request.url,
      text: () => request.text(),
      json: () => request.json(),
      method: request.method,
      pathname: request.nextUrl.pathname,
      searchParams,
      headers,
      ...props,
    },
  };
  return context;
}
