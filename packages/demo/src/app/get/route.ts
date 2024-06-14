import { createRoute, getNextContext } from 'next-compose-middlewares';
import { user } from '../../middlewares';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const GET = createRoute([
  user,
  async ({ user, res,type }) => {
    await sleep(1000);
    res.cookie('x-user', 'yiminghe', { path: '/' });
    res.set('x-from', 'next-compose');
    res.json({ user, user2: getNextContext().user,type });
  },
]);
