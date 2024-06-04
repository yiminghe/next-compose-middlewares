import { NextResponse } from 'next/server';
import type { MiddlewareFunction, NextContext, NextFunction } from './types';
import { redirect } from 'next/navigation';
/**
 *@public
 */
export function createFinishMiddleware(): MiddlewareFunction {
  return async ({ res }: NextContext, next?: NextFunction): Promise<any> => {
    await next?.();
    if (res._private.redirect) {
      return redirect(res._private.redirect);
    }
    if (res._private.render !== undefined) {
      return res._private.render as any;
    }
    if (res._private.json) {
      return NextResponse.json(res._private.json, {
        status: res._private.status,
        headers: res._private.headers,
      });
    }
  };
}
