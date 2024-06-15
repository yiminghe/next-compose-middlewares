import type { NextContext, CookieOptions } from './types';
import type { NextRequest } from 'next/server';
import { cookies as getCookies, headers as getHeaders } from 'next/headers';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

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
  let headers = getHeaders();
  return new Proxy(
    {},
    {
      get: function (target, prop: string, receiver) {
        return headers.get(prop);
      },
      has(target, key: string) {
        return headers.has(key);
      },
      set() {
        throw new Error('Next cannot set headers');
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
    clearCookie(
      name: string,
      options?: Omit<CookieOptions, 'expires' | 'maxAge'>,
    ) {
      getCookies().set(name, '', {
        ...options,
        expires: new Date(0),
      });
    },
    cookie(name: string, value: any, options?: CookieOptions) {
      getCookies().set(name, value, options);
    },
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

function buildRequest() {
  const headers = transformHeadersToObject();
  function get(k: string) {
    return headers[k];
  }
  if (!headers['x-forwarded-uri']) {
    throw new Error('must setup middleware!');
  }
  const stringUrl = `${headers['x-forwarded-proto']}://${headers['x-forwarded-host']}${headers['x-forwarded-uri']}`;
  const url = new URL(stringUrl);
  const searchParams: Record<string, any> = {};
  for (const [k, v] of Array.from(url.searchParams.entries())) {
    searchParams[k] = v;
  }
  const protocol = url.protocol.slice(0, -1);
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
    path: url.pathname,
    query: searchParams,
    protocol,
    ip: headers['x-forwarded-for'] || headers['ncm-ip'],
    headers,
    get,
    header: get,
  };
}

/**
 *@public
 */
export function createNextContextFromPage(type: 'page' | 'layout' = 'page') {
  const res = buildResponse();
  function cookie(name: string, value: any, options?: CookieOptions) {
    res._private.cookies = res._private.cookies || {};
    res._private.cookies[name] = { ...options, value } as any;
    if (options?.expires) {
      res._private.cookies[name].expires = +options.expires;
    }
  }
  const context: NextContext = {
    type,
    req: buildRequest(),
    res: {
      ...res,
      cookie,
      clearCookie(
        name: string,
        options?: Omit<CookieOptions, 'expires' | 'maxAge'>,
      ) {
        cookie(name, '', { ...options, expires: new Date(0) });
      },
    },
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
