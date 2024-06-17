'use server';

import { createAction } from '@/middlewares';
import { getNextContext } from 'next-compose-middlewares';

export default createAction(async (time: number) => {
  return { time, user: getNextContext().user, type: getNextContext().type };
});
