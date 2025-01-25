import { getNextContext as getNextContext2 } from '@/next-compose-middlewares';
export function getNextContext(): Required<ReturnType<typeof getNextContext2>> {
  return getNextContext2() as any;
}
