import type { NextContext as NextContext2 } from 'next-compose-middleware';

declare module 'next-compose-middleware' {
  interface NextContext {
    user: string;
  }
}
