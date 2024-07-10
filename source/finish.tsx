import { NextResponse } from 'next/server';
import type { MiddlewareFunction, NextContext, NextContextResponseInternal, NextFunction } from './types';
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
  ) {
    await next();
    const {
      return: returnValue,
      cookies,
      render,
      json,
      status,
      headers,
      redirect: redirectUrl,
    } = (res as NextContextResponseInternal)._private;
    if (redirectUrl) {
      return redirect(redirectUrl);
    }
    if (type === 'page' || type === 'layout') {
      return (
        <>
          {cookies && <ClientCookies key="cookies" cookies={cookies} />}
          <Fragment key="main">{render || returnValue}</Fragment>
        </>
      );
    }
    if (type === 'route' && json) {
      return NextResponse.json(json, {
        status,
        headers,
      });
    }
    return returnValue;
  };
}
