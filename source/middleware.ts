
import { NextRequest, NextResponse } from 'next/server';

const URI_HEADER = 'x-forwarded-uri';
const NEXT_URL_HEADER = 'x-next-url';
/**
 *@public
 */
export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(NEXT_URL_HEADER, nextUrl.toString());
  if (!req.headers.get(URI_HEADER)) {
    requestHeaders.set(URI_HEADER, nextUrl.pathname + nextUrl.search);
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
