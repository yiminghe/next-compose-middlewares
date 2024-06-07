import { NextResponse } from 'next/server';
import type { MiddlewareFunction, NextContext, NextFunction } from './types';
import { redirect } from 'next/navigation';
import ClientCookies from './ClientCookies';
import React from 'react';
/**
 *@public
 */
export function createFinishMiddleware(): MiddlewareFunction {
  return async (
    { res, type }: NextContext,
    next?: NextFunction,
  ): Promise<any> => {
    await next?.();
    const private_ = res._private;
    if (private_.redirect) {
      return redirect(private_.redirect);
    }
    if (type === 'page' && private_.render !== undefined) {
      if (private_.cookies) {
        return (
          <ClientCookies cookies={private_.cookies}>
            {private_.render}
          </ClientCookies>
        );
      } else {
        return private_.render;
      }
    }
    if (type === 'route' && private_.json) {
      return NextResponse.json(private_.json, {
        status: private_.status,
        headers: private_.headers,
      });
    }
  };
}
