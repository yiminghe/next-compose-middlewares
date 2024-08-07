import type {
  NextContext,
  MiddlewareFunction,
  NextContextResponseInternal,
} from './types';
import type { NextRequest } from 'next/server';
import { compose } from './compose';
import {
  createNextContextFromAction,
  createNextContextFromPage,
  createNextContextFromRoute,
} from './next-context';
import {
  setPageContext,
  setRouteContext,
  requestStorage,
  isPageContextInitialized,
  getPageContext,
} from './set-context';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import ClientCookies from './ClientCookies';
import React, { Fragment } from 'react';

export type {
  NextContextResponse,
  NextContextRequest,
  NextContextType,
  NextContext,
  MiddlewareFunction,
  NextFunction,
  CookieAttributes,
} from './types';

export {
  getNextContext,
  // attach data to context directly
  //  createNextContext,
  //  type GetSetNextContext
} from './set-context';

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
export type ReturnedRender = React.ReactNode;
/**
 *@public
 */
export type PageFunction = (
  r: PageRequest,
) => ReturnedRender | Promise<ReturnedRender>;

function doRedirect(context: NextContext) {
  const { redirectUrl } = getPrivate(context);
  if (redirectUrl) {
    redirect(redirectUrl);
    return 1;
  }
  return 0;
}

function getPrivate(context: NextContext) {
  return (context.res as NextContextResponseInternal)._private;
}
/**
 *@public
 */
export function withPageMiddlewares(fns: MiddlewareFunction[]) {
  return function (Page: PageFunction): PageFunction {
    const P = async (...args: any) => {
      const r = args[0];
      const context = isPageContextInitialized()
        ? getPageContext()
        : createNextContextFromPage();
      if (r?.params) {
        context.req.params = r.params;
      }
      setPageContext(context);
      await compose(fns, context, noop, ...args);
      if (doRedirect(context)) {
        return;
      }
      const ret = Page.apply(null, args);
      await ret;
      if (doRedirect(context)) {
        return;
      }
      const { cookies } = getPrivate(context);
      return (
        <>
          {cookies && <ClientCookies key="cookies" cookies={cookies} />}
          <Fragment key="main">{ret as any}</Fragment>
        </>
      );
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
    const R = (...args: any) => {
      const r = args[0];
      const c = args[1];
      const context = createNextContextFromRoute(r);
      if (c?.params) {
        context.req.params = c.params;
      }
      return requestStorage.run(new Map(), async () => {
        setRouteContext(context);
        await compose(fns, context, noop, ...args);
        if (doRedirect(context)) {
          return;
        }
        const ret = Route.apply(null, args);
        await ret;
        const { status, headers, json } = getPrivate(context);
        if (doRedirect(context)) {
          return;
        }
        if (json) {
          return NextResponse.json(json, {
            status,
            headers,
          });
        }
        return ret;
      });
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
    const a = (...args: any) => {
      const context = createNextContextFromAction();
      return requestStorage.run(new Map(), async () => {
        setRouteContext(context);
        await compose(fns, context, noop, ...args);
        if (doRedirect(context)) {
          return;
        }
        const ret = action.apply(null, args);
        await ret;
        if (doRedirect(context)) {
          return;
        }
        return ret;
      });
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
