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
    return handle(getNextContextFromPage(props.req?.()));
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
    return handle(getNextContextFromRoute(r, props.req?.(r)));
  };
  if (props.name) {
    Route.name = props.name;
  }
  return Route;
}

function transformCookiesToObject(): any {
  const cookies = getCookies();
  return new Proxy(
    {},
    {
      get: function (target, prop: string, receiver) {
        return cookies.get(prop)?.value;
      },
      has(target, key: string) {
        return cookies.has(key);
      },
      getOwnPropertyDescriptor(target, key: string) {
        if (cookies.has(key)) {
          return {
            configurable: true,
            enumerable: true,
            value: cookies.get(key)!.value,
          };
        }
      },
      ownKeys(target) {
        return cookies.getAll().map((c) => c.name);
      },
    },
  );
}

function transformHeadersToObject(): any {
  const headers = getHeaders();
  return new Proxy(
    {},
    {
      get: function (target, prop: string, receiver) {
        return headers.get(prop);
      },
      has(target, key: string) {
        return headers.has(key);
      },
      getOwnPropertyDescriptor(target, key: string) {
        if (headers.has(key)) {
          return {
            configurable: true,
            enumerable: true,
            value: headers.get(key),
          };
        }
      },
      ownKeys(target) {
        return Array.from(headers.keys());
      },
    },
  );
}

function buildResponse(): NextContext['res'] {
  const p: NextContext['res']['_private'] = {
    status: 200,
    headers: {},
  };
  return {
    _private: p,
    append(k: string, v: any) {
      p.headers[k] = p.headers[k] ?? '';
      p.headers[k] += v;
    },
    set(...args: any) {
      const [k, v] = args;
      if (typeof k === 'string') {
        p.headers[k] = v;
        return;
      }
      Object.assign(p.headers, k);
    },
    get(k: string) {
      return p.headers[k];
    },
    status(s: number) {
      p.status = s;
    },
    render(n: React.ReactNode) {
      p.render = n;
    },
    json(j: any) {
      p.json = j;
    },
    redirect(r: string) {
      p.redirect = r;
    },
  };
}

function buildHeaderApi() {
  const headers = transformHeadersToObject();
  function get(k: string) {
    return headers[k];
  }
  return {
    headers,
    get,
    header: get,
  };
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
    headers,
    req: {
      url,
      text: () =>
        new Promise((r) => {
          r('');
        }),
      json: () =>
        new Promise((r) => {
          r({});
        }),
      cookies: transformCookiesToObject(),
      ...buildHeaderApi(),
      path: new URL(url).pathname,
      method: 'GET',
      query: searchParams,
      ...props,
    },
    res: buildResponse(),
  };
  return context;
}
/**
 *@public
 */
export function getNextContextFromRoute(
  req: NextRequest,
  props: RouteRequest = {},
) {
  const searchParams: Record<string, any> = {};
  for (const [k, v] of Array.from(req.nextUrl.searchParams.entries())) {
    searchParams[k] = v;
  }
  const cookies = getCookies();

  const headers = getHeaders();
  const context: NextContext = {
    type: 'route',
    cookies,
    headers,
    res: buildResponse(),
    req: {
      url: req.url,
      text: () => req.text(),
      json: () => req.json(),
      method: req.method,
      path: req.nextUrl.pathname,
      query: searchParams,
      cookies: transformCookiesToObject(),
      ...buildHeaderApi(),
      ...props,
    },
  };
  return context;
}
