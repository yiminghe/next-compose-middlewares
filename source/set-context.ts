// @ts-ignore
import { cache } from 'react';
import type { NextContext } from './types';
/**
 *@public
 */
export function createPageContext<T>(defaultValue: T): GetSetNextContext<T> {
  const ref = cache(() => ({ current: defaultValue }));

  const get = (): T => ref().current;

  const set = (value: T) => {
    ref().current = value;
  };

  return [get, set];
}

const defaultContext = Object.freeze({}) as NextContext;

/**
 *@public
 */
export const [
  /**
   *@public
   */
  getPageContext,
  /**
   *@public
   */
  setPageContext,
] = createPageContext(defaultContext);

export const requestStorage = new AsyncLocalStorage<Map<Function, any>>();

/**
 *@public
 */
export function createRouteContext<T>(defaultValue: T): GetSetNextContext<T> {
  const get = (): T => requestStorage.getStore()!.get(get) || defaultValue;

  const set = (v: T) => requestStorage.getStore()!.set(get, v);

  return [get, set];
}

/**
 *@public
 */
export const [
  /**
   *@public
   */
  getRouteContext,
  /**
   *@public
   */
  setRouteContext,
] = createRouteContext(defaultContext);

export function isPageContextInitialized() {
  return getPageContext() !== defaultContext;
}
type NestedOmit<
  Schema,
  Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof Schema
    ? {
        [K in keyof Schema]: K extends Head
          ? NestedOmit<Schema[K], Tail>
          : Schema[K];
      }
    : Schema
  : Omit<Schema, Path>;

export const PAGE_TOKEN = Symbol('page');
/**
 *@public
 */
export function getNextContext() {
  const context = getPageContext();
  return context == defaultContext ? getRouteContext() : context;
}

/**
 *@public
 */
export type GetSetNextContext<T> = [() => T, (v: T) => any];

/**
 *@public
 */
export function createNextContext<T>(c: T): GetSetNextContext<T> {
  let getSetPage: GetSetNextContext<T> = [] as any;
  let getSetRoute: GetSetNextContext<T> = [] as any;
  function init() {
    const context = getNextContext() || {};
    if (context.type === 'page') {
      if (getSetPage.length) {
        return getSetPage;
      }
      getSetPage = createPageContext(c);
      return getSetPage;
    } else if (context.type === 'route' || context.type === 'action') {
      if (getSetRoute.length) {
        return getSetRoute;
      }
      getSetRoute = createRouteContext(c);
      return getSetRoute;
    }
    throw new Error('must call after middleware init');
  }
  const get = () => {
    return init()[0]();
  };
  const set = (v: T) => {
    return init()[1](v);
  };
  return [get, set];
}
