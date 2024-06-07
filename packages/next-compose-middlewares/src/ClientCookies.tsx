'use client';

import { useEffect } from 'react';
import type { ClientCookies } from './types';
import Cookies from 'js-cookie';

export default function ClientCookies({
  cookies,
  children,
}: {
  children: any;
  cookies?: ClientCookies;
}) {
  useEffect(() => {
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
  return children;
}
