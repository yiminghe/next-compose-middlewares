'use client';

import { useLayoutEffect } from 'react';
import type { ClientCookies } from './types';
import * as Cookies from './cookies';

export default function ClientCookies({
  cookies,
}: {
  cookies?: ClientCookies;
}) {
  useLayoutEffect(() => {
    if (cookies) {
      for (const key of Object.keys(cookies)) {
        let { value, options } = cookies[key]!;
        if (typeof options.expires === 'number') {
          options = {
            ...options,
            expires: new Date(options.expires),
          };
        }
        Cookies.set(key, value, options);
      }
    }
  }, [cookies]);
  return null;
}
