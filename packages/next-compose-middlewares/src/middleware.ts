import { NextRequest, NextResponse } from 'next/server';
/**
 *@public
 */
export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-url', req.url);
  requestHeaders.set('x-ip', req.ip || '');
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
