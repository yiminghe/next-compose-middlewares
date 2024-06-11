// @ts-ignore
import { cache } from 'react';
import type { NextContext } from './types';

/**
 *@public
 */
export function createServerContext<T>(
  defaultValue: T,
): [() => T, (v: T) => void] {
  const getRef = cache(() => ({ current: defaultValue }));

  const getValue = (): T => getRef().current;

  const setValue = (value: T) => {
    getRef().current = value;
  };

  return [getValue, setValue];
}

/**
 *@public
 */
export const [
  /**
   *@public
   */
  getServerContext,
  /**
   *@public
   */
  setServerContext,
] = createServerContext({} as NextContext);
