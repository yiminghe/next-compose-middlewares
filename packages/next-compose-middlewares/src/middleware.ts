import { NextRequest, NextResponse } from 'next/server';

const URI_HEADER = 'x-forwarded-uri';
/**
 *@public
 */
export async function middleware(req: NextRequest) {
  if (req.headers.get(URI_HEADER)) {
    return;
  }
  const requestHeaders = new Headers(req.headers);
  const url = req.nextUrl;
  requestHeaders.set(URI_HEADER, url.pathname + url.search);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
