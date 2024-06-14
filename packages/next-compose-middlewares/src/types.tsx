import type React from 'react';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
/**
 *@public
 */
export type NextFunction = () => Promise<any> | void;

/**
 *@public
 */
export type CookieOptions = Omit<
  ResponseCookie,
  'expires' | 'name' | 'value'
> & { expires?: Date };

/**
 *@public
 */
export type ClientCookies = {
  [key: string]: Omit<ResponseCookie, 'expires'> & { expires?: number };
};

/**
 *@public
 */
export interface NextContext {
  type: 'page' | 'route' | 'action';
  req: {
    params: any;
    host: string;
    protocol: string;
    secure: boolean;
    url: string;
    ip: string | undefined;
    get: (k: string) => any;
    header: (k: string) => any;
    text: () => Promise<string>;
    json: () => Promise<any>;
    method: string;
    path: string;
    query: any;
    cookies: any;
    headers: any;
  };
  res: {
    _private: {
      cookies?: ClientCookies;
      headers: any;
      redirect?: string;
      render?: React.ReactNode;
      json?: any;
      status?: number;
    };
    clearCookie: (
      name: string,
      options?: Omit<CookieOptions, 'expires' | 'maxAge'>,
    ) => void;
    cookie: (name: string, value: any, options?: CookieOptions) => void;
    append: (k: string, v: any) => void;
    set: (...args: [key: string, v: any] | [o: any]) => void;
    get: (key: string) => any;
    redirect: (r: string) => void;
    render: (r: React.ReactNode) => void;
    json: (j: any) => void;
    status: (s: number) => void;
  };
}

/**
 *@public
 */
export type MiddlewareFunction = (
  context: NextContext,
  next: NextFunction,
) => Promise<any> | void;
