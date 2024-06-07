import type {
  NextContext,
  MiddlewareFunction,
  NextFunction,
  CookieOptions,
} from './types';
import type { NextRequest } from 'next/server';
import { cookies as getCookies, headers as getHeaders } from 'next/headers';
import { compose } from './compose';
import { createFinishMiddleware } from './finish';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

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
  let cookies: ReadonlyRequestCookies;
  function getCookie() {
    if (cookies) {
      return cookies;
    }
    cookies = getCookies();
    return cookies;
  }
  return new Proxy(
    {},
    {
      get: function (target, prop: string, receiver) {
        return getCookie().get(prop)?.value;
      },
      has(target, key: string) {
        return getCookie().has(key);
      },
      getOwnPropertyDescriptor(target, key: string) {
        if (getCookie().has(key)) {
          return {
            configurable: true,
            enumerable: true,
            value: getCookie().get(key)!.value,
          };
        }
      },
      ownKeys(target) {
        return getCookie()
          .getAll()
          .map((c) => c.name);
      },
    },
  );
}

function transformHeadersToObject(): any {
  let headers: ReadonlyHeaders;
  function getHeader() {
    if (headers) {
      return headers;
    }
    headers = getHeaders();
    return headers;
  }
  return new Proxy(
    {},
    {
      get: function (target, prop: string, receiver) {
        return getHeader().get(prop);
      },
      has(target, key: string) {
        return getHeader().has(key);
      },
      getOwnPropertyDescriptor(target, key: string) {
        if (getHeader().has(key)) {
          return {
            configurable: true,
            enumerable: true,
            value: getHeader().get(key),
          };
        }
      },
      ownKeys(target) {
        return Array.from(getHeader().keys());
      },
    },
  );
}

function buildResponse(): Omit<NextContext['res'], 'cookie'> {
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

  const res = buildResponse();
  function cookie(name: string, value: any, options?: CookieOptions) {
    res._private.cookies = res._private.cookies || {};
    res._private.cookies[name] = { ...options, value } as any;
    if (options?.expires) {
      res._private.cookies[name].expires = +options.expires;
    }
  }

  const context: NextContext = {
    type: 'page',
    cookies: () => getCookies(),
    headers: () => getHeaders(),
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
    res: {
      ...res,
      cookie,
    },
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

  const context: NextContext = {
    type: 'route',
    cookies: () => getCookies(),
    headers: () => getHeaders(),
    res: {
      ...buildResponse(),
      cookie(name: string, value: any, options?: CookieOptions) {
        getCookies().set(name, value, options);
      },
    },
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
