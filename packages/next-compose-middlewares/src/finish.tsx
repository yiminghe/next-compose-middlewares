import { NextResponse } from 'next/server';
import type { MiddlewareFunction, NextContext, NextFunction } from './types';
import { redirect } from 'next/navigation';
import ClientCookies from './ClientCookies';
import React, { Fragment } from 'react';
/**
 *@public
 */
export function createFinishMiddleware(): MiddlewareFunction {
  return async (
    { res, type }: NextContext,
    next: NextFunction,
  ): Promise<any> => {
    const ret = await next();
    const private_ = res._private;
    if (private_.redirect) {
      return redirect(private_.redirect);
    }
    if (type === 'page' || type === 'layout') {
      return (
        <>
          {private_.cookies && (
            <ClientCookies key="cookies" cookies={private_.cookies} />
          )}
          <Fragment key="main">{private_.render || ret}</Fragment>
        </>
      );
    }
    if (type === 'route' && private_.json) {
      return NextResponse.json(private_.json, {
        status: private_.status,
        headers: private_.headers,
      });
    }
    return ret;
  };
}
