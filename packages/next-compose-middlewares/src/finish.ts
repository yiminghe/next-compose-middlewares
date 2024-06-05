import { NextResponse } from 'next/server';
import type { MiddlewareFunction, NextContext, NextFunction } from './types';
import { redirect } from 'next/navigation';
/**
 *@public
 */
export function createFinishMiddleware(): MiddlewareFunction {
  return async (
    { res, type }: NextContext,
    next?: NextFunction,
  ): Promise<any> => {
    await next?.();
    if (res._private.redirect) {
      return redirect(res._private.redirect);
    }
    if (type === 'page' && res._private.render !== undefined) {
      return res._private.render as any;
    }
    if (type === 'route' && res._private.json) {
      return NextResponse.json(res._private.json, {
        status: res._private.status,
        headers: res._private.headers,
      });
    }
  };
}
