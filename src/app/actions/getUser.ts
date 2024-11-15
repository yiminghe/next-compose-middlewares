'use server';

import { createAction } from '@/middlewares';
import { getNextContext } from '@/next-compose-middlewares';
import { testTime } from '../services/getTime';

export default createAction(async (time: number) => {
  return {
    ...(await testTime()),
    time,
    user: getNextContext().user,
    type: getNextContext().type
  };
});
