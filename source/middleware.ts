import { NextRequest, NextResponse } from 'next/server';
import {
  FORWARDED_URI_HEADER,
  NEXT_BASE_PATH_HEADER,
  NEXT_URL_HEADER,
} from './constants';
import { compose } from './compose';

export interface HeaderContext {
  req: NextRequest;
  headers: Headers;
}

export interface ResponseContext extends HeaderContext {
  res: NextResponse;
}
export interface MiddlewareMiddleware {
  header?: (arg: HeaderContext, next: () => Promise<void>) => Promise<void>;
  response?: (arg: ResponseContext, next: () => Promise<void>) => Promise<void>;
}

/**
 * nextjs middleware factory
 *@public
 */
export function createMiddleware(ms: MiddlewareMiddleware[] = []) {
  return async (req: NextRequest) => {
    const { nextUrl } = req;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set(NEXT_URL_HEADER, nextUrl.toString());
    requestHeaders.set(NEXT_BASE_PATH_HEADER, nextUrl.basePath);
    if (!req.headers.get(FORWARDED_URI_HEADER)) {
      requestHeaders.set(
        FORWARDED_URI_HEADER,
        nextUrl.basePath + nextUrl.pathname + nextUrl.search,
      );
    }
    const context: HeaderContext = {
      req,
      headers: requestHeaders,
    };
    const headerMiddlewares = ms.map((m) => m.header).filter((m) => !!m);
    if (headerMiddlewares.length) {
      await compose(headerMiddlewares, context);
    }
    const res = NextResponse.next({
      request: {
        headers: context.headers,
      },
    });
    const responseContext: ResponseContext = {
      ...context,
      res,
    };
    const responseMiddlewares = ms.map((m) => m.response).filter((m) => !!m);
    if (responseMiddlewares.length) {
      await compose(responseMiddlewares, responseContext);
    }
    return responseContext.res;
  };
}
