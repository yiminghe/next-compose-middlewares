import { NextRequest, NextResponse } from 'next/server';
import {
  FORWARDED_URI_HEADER,
  NEXT_BASE_PATH_HEADER,
  NEXT_URL_HEADER,
} from './constants';
/**
 *@public
 */
export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(NEXT_URL_HEADER, nextUrl.toString());
  requestHeaders.set(NEXT_BASE_PATH_HEADER, nextUrl.basePath);
  if (!req.headers.get(FORWARDED_URI_HEADER)) {
    requestHeaders.set(
      FORWARDED_URI_HEADER,
      nextUrl.basePath + nextUrl.pathname + nextUrl.search,
    );
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
