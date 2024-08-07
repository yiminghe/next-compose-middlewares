import type {
  NextContext,
  CookieAttributes,
  NextContextResponseInternal,
} from './types';
import type { NextRequest } from 'next/server';
import { cookies as getCookies, headers as getHeaders } from 'next/headers';
import {
  NEXT_URL_HEADER,
  FORWARDED_URI_HEADER,
  FORWARDED_PROTO_HEADER,
  FORWARDED_HOST_HEADER,
  FORWARDED_FOR_HEADER,
  NEXT_BASE_PATH_HEADER,
} from './constants';
import { NextURL } from 'next/dist/server/web/next-url';

function transformCookiesToObject(): any {
  const originals = getCookies().getAll();
  const cookies: any = {};
  for (const h of originals) {
    cookies[h.name] = h.value;
  }
  return cookies;
}

function transformHeadersToObject(): any {
  const originals = getHeaders();
  const headers: any = {};
  for (const h of Array.from(originals.keys())) {
    headers[h] = originals.get(h);
  }
  return headers;
}

function buildResponse(): NextContextResponseInternal {
  const p: NextContextResponseInternal['_private'] = {
    status: 200,
    headers: {},
  };
  const res = {
    _private: p,
    clearCookie(name: string, options?: CookieAttributes) {
      getCookies().set(name, '', {
        ...options,
        expires: new Date(0),
      });
    },
    cookie(name: string, value: string, options?: CookieAttributes) {
      if (options?.maxAge) {
        options.expires = Date.now() + options.maxAge;
      }
      getCookies().set(name, value, options);
    },
    append(k: string, v: string) {
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
    json(j: any) {
      p.json = j;
    },
    redirect(r: string) {
      p.redirectUrl = r;
    },
  };
  return res;
}

function buildRequest() {
  const headers = transformHeadersToObject();
  function get(k: string) {
    return headers[k];
  }
  if (!headers[FORWARDED_URI_HEADER]) {
    throw new Error('must setup middleware!');
  }
  const stringUrl = `${headers[FORWARDED_PROTO_HEADER]}://${headers[FORWARDED_HOST_HEADER]}${headers[FORWARDED_URI_HEADER]}`;
  const url = new URL(stringUrl);
  const searchParams: Record<string, any> = {};
  for (const [k, v] of Array.from(url.searchParams.entries())) {
    searchParams[k] = v;
  }
  const protocol = url.protocol.slice(0, -1);
  const nextUrl = new NextURL(headers[NEXT_URL_HEADER]);
  nextUrl.basePath = headers[NEXT_BASE_PATH_HEADER];
  nextUrl.pathname = nextUrl.pathname.slice(nextUrl.basePath.length);
  return {
    params: {},
    method: 'GET',
    cookies: transformCookiesToObject(),
    text: () =>
      new Promise<string>((r) => {
        r('');
      }),
    json: () =>
      new Promise<any>((r) => {
        r({});
      }),
    host: url.host,
    secure: protocol === 'https',
    url: url.toString(),
    nextUrl,
    path: url.pathname,
    query: searchParams,
    protocol,
    ip: headers[FORWARDED_FOR_HEADER],
    headers,
    get,
    header: get,
  };
}

export function buildPageResponse() {
  const res = buildResponse();
  function cookie(name: string, value: string, options?: CookieAttributes) {
    if (options?.maxAge) {
      options.expires = Date.now() + options.maxAge;
    }
    res._private.cookies = res._private.cookies || {};
    res._private.cookies[name] = { ...options, value };
    if (options?.expires) {
      res._private.cookies[name].expires = +options.expires;
    }
  }
  return {
    ...res,
    cookie,
    clearCookie(name: string, options?: CookieAttributes) {
      cookie(name, '', { ...options, expires: new Date(0) });
    },
  };
}

/**
 *@public
 */
export function createNextContextFromPage() {
  const context: NextContext = {
    type: 'page',
    req: buildRequest(),
    res: buildPageResponse(),
  };
  return context;
}
/**
 *@public
 */
export function createNextContextFromAction() {
  const res = buildResponse();
  const context: NextContext = {
    type: 'action',
    req: {
      ...buildRequest(),
      method: 'POST',
    },
    res,
  };
  return context;
}

/**
 *@public
 */
export function createNextContextFromRoute(req: NextRequest) {
  const context: NextContext = {
    type: 'route',
    res: buildResponse(),
    req: {
      ...buildRequest(),
      text: () => req.text(),
      json: () => req.json(),
      method: req.method,
    },
  };
  return context;
}
