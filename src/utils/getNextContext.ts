import { getNextContext as getNextContext2 } from '@/next-context';
export function getNextContext(): Required<ReturnType<typeof getNextContext2>> {
  return getNextContext2() as any;
}
