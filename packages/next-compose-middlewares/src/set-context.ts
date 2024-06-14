// @ts-ignore
import { cache } from 'react';
import type { NextContext } from './types';

/**
 *@public
 */
export function createPageContext<T>(
  defaultValue: T,
): GetSetNextContext<T> {
  const getRef = cache(() => ({ current: defaultValue }));

  const getValue = (): T => getRef().current;

  const setValue = (value: T, callback: () => unknown) => {
    getRef().current = value;
    return callback();
  };

  return [getValue, setValue];
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

/**
 *@public
 */
export function createRouteContext<T>(defaultValue: T):
  GetSetNextContext<T> {
  const s = new AsyncLocalStorage<T>();
  let value = defaultValue;
  const getRouteContext = (): T => s.getStore() || value;

  const runInRouteContext = (v: T, callback: () => unknown) => s.run(v, callback);

  return [getRouteContext, runInRouteContext];
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
  runInRouteContext,
] = createRouteContext(defaultContext);

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
export type GetSetNextContext<T> = [() => T, (v: T, callback: () => unknown) => unknown];

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
      return getSetPage
    } else if (context.type === 'route') {
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
  const run = (v: T, callback: () => unknown) => {
    return init()[1](v, callback);
  };
  return [get, run];
}
