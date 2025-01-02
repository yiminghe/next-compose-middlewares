let action: string = '';
let originalFetch: typeof fetch;
function myFetch(r: any, options?: RequestInit) {
  const newOptions =
    action && !!(options?.headers as any)?.['Next-Action']
      ? {
          ...options,
          headers: {
            ...options?.headers,
            'x-action': action,
          },
        }
      : options;
  return originalFetch(r, newOptions);
}
export async function runWithActionName<T>(
  s: string,
  fn: () => Promise<T>,
): Promise<T> {
  originalFetch = self.fetch;
  self.fetch = myFetch;
  action = s;
  let ret;
  try {
    ret = await fn();
  } finally {
    action = '';
    self.fetch = originalFetch;
  }
  return ret;
}
