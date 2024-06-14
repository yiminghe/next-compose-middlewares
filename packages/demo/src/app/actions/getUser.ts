'use server';

import { user } from '@/middlewares';
import { createAction, getNextContext } from 'next-compose-middlewares';

export default createAction([user], async (time: number) => {
  return { time, user: getNextContext().user, type: getNextContext().type };
});
