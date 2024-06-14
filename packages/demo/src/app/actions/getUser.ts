'use server';

import { user } from '@/middlewares';
import { createAction, getNextContext } from 'next-compose-middlewares';

export default createAction([
  user,
  async ({ user }) => {
    return { user, user2: getNextContext().user, type: getNextContext().type };
  },
]);
