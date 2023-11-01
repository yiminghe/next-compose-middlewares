import { NextRequest } from 'next/server';
import type React from 'react';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
/**
 *@public
 */
export type NextFunction = () => Promise<any> | void;

/**
 *@public
 */
export interface NextContext {
  type: 'page' | 'route';

  cookies: ResponseCookies;
  request: {
    url: string;
    text: () => Promise<string>;
    json: () => Promise<any>;
    method: string;
    pathname: string;
    searchParams: any;
    headers: NextRequest['headers'];
  };
  response: {
    redirect?: string;
    text?: () => string;
    jsx?: React.ReactNode;
    json?: any;
    status: number;
    message?: string;
    headers?: any;
  };
}

/**
 *@public
 */
export type MiddlewareFunction = (
  context: NextContext,
  next?: NextFunction,
) => Promise<any> | void;
