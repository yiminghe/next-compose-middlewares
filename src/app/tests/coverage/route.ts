import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    coverage: (global as any).__coverage__,
  });
}
