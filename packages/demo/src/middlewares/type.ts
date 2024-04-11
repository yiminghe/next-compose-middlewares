import type { NextContext as NextContext2 } from 'next-compose-middlewares';

declare module 'next-compose-middlewares' {
  interface NextContext {
    user: string;
  }
}
