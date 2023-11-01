import { NextResponse } from 'next/server';
import type { MiddlewareFunction, NextContext, NextFunction } from './types';
import { redirect } from 'next/navigation';
/**
 *@public
 */
export function createFinishMiddleware(): MiddlewareFunction {
  return async (
    { response }: NextContext,
    next?: NextFunction,
  ): Promise<any> => {
    await next?.();
    if (response.redirect) {
      return redirect(response.redirect);
    }
    if (response.jsx !== undefined) {
      return response.jsx as any;
    }
    if (response.json) {
      return NextResponse.json(response.json, {
        status: response.status,
        headers: response.headers,
      });
    }
  };
}
