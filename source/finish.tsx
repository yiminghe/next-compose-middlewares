import { NextResponse } from 'next/server';
import type {
  MiddlewareFunction,
  NextContext,
  NextContextResponseInternal,
  NextFunction,
} from './types';
import { redirect } from 'next/navigation';
import ClientCookies from './ClientCookies';
import React, { Fragment } from 'react';
/**
 *@public
 */
export function createFinishMiddleware(): MiddlewareFunction {
  return async function finishMiddleware(
    { res, type }: NextContext,
    next: NextFunction,
    ...args: any
  ) {
    await next();
    const id: string | symbol = args[args.length - 1];
    const {
      return: returnValue,
      cookies,
      json,
      status,
      headers,
      redirect: redirectUrl,
    } = (res as NextContextResponseInternal)._private;
    if (redirectUrl) {
      return redirect(redirectUrl);
    }
    const value = returnValue[id];
    if (type === 'page' || type === 'layout') {
      return (
        <>
          {cookies && <ClientCookies key="cookies" cookies={cookies} />}
          <Fragment key="main">{value}</Fragment>
        </>
      );
    }
    if (type === 'route' && json) {
      return NextResponse.json(json, {
        status,
        headers,
      });
    }
    return value;
  };
}
