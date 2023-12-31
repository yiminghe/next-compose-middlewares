## API Report File for "next-compose-middlewares"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { default as React_2 } from 'react';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

// @public (undocumented)
export function compose(middleware: Function[]): (context: any, next?: Function) => Promise<any>;

// @public (undocumented)
export function createFinishMiddleware(): MiddlewareFunction;

// @public (undocumented)
export function createPage(fns: MiddlewareFunction[], props?: createPageProps): {
    (): Promise<any>;
    name: string;
};

// @public (undocumented)
export interface createPageProps {
    // (undocumented)
    name?: string;
    // (undocumented)
    request?: () => PageRequest;
}

// @public (undocumented)
export function createRoute(fns: MiddlewareFunction[], props?: createRouteProps): {
    (r: NextRequest): Promise<any>;
    name: string;
};

// @public (undocumented)
export interface createRouteProps {
    // (undocumented)
    name?: string;
    // (undocumented)
    request?: (r: NextRequest) => RouteRequest;
}

// @public (undocumented)
export const finishMiddleware: MiddlewareFunction;

// @public (undocumented)
export function getNextContextFromPage(props?: PageRequest): NextContext;

// @public (undocumented)
export function getNextContextFromRoute(request: NextRequest, props?: RouteRequest): NextContext;

// @public (undocumented)
export function middleware(request: NextRequest): Promise<NextResponse<unknown>>;

// @public (undocumented)
export type MiddlewareFunction = (context: NextContext, next?: NextFunction) => Promise<any> | void;

// @public (undocumented)
export interface NextContext {
    // (undocumented)
    cookies: ResponseCookies;
    // (undocumented)
    request: {
        url: string;
        text: () => Promise<string>;
        json: () => Promise<any>;
        method: string;
        pathname: string;
        searchParams: any;
        headers: NextRequest['headers'];
    };
    // (undocumented)
    response: {
        redirect?: string;
        text?: () => string;
        jsx?: React_2.ReactNode;
        json?: any;
        status: number;
        message?: string;
        headers?: any;
    };
    // (undocumented)
    type: 'page' | 'route';
}

// @public (undocumented)
export type NextFunction = () => Promise<any> | void;

// @public (undocumented)
export interface PageRequest {
    // (undocumented)
    json?: () => Promise<any>;
    // (undocumented)
    method?: string;
    // (undocumented)
    params?: any;
    // (undocumented)
    text?: () => Promise<string>;
}

// @public (undocumented)
export interface RouteRequest {
    // (undocumented)
    params?: any;
}

// (No @packageDocumentation comment for this package)

```
