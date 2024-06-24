import type { NextContext } from '@/next-compose-middlewares';
declare module '@/next-compose-middlewares' {
  interface NextContext {
    user: string;
  }
}
