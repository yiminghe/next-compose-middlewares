'use client';

import { useLayoutEffect } from 'react';
import type { ClientCookies } from './types';
import Cookies from 'js-cookie';

export default function ClientCookies({
  cookies,
}: {
  cookies?: ClientCookies;
}) {
  useLayoutEffect(() => {
    if (cookies) {
      for (const key of Object.keys(cookies)) {
        const value = cookies[key]!;
        let options: Cookies.CookieAttributes = value as any;
        if (typeof options.expires === 'number') {
          options = {
            ...options,
            expires: new Date(options.expires),
          };
        }
        Cookies.set(key, value.value, options);
      }
    }
  }, [cookies]);
  return null;
}
