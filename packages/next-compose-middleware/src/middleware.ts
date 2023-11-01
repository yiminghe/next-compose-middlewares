import { NextRequest, NextResponse } from 'next/server';
/**
 *@public
 */
export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
