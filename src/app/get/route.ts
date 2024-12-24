import { getNextContext } from '@/next-compose-middlewares';
import { createRoute } from '../../middlewares';
import { testTime } from '../services/getTime';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const GET = createRoute(async function Get(...args) {
  const context = getNextContext();
  const { user, res, type } = context;
  context.extraContent = {
    from: 'route',
  };
  await sleep(1000);
  res.cookie('x-user-from-route', 'yiminghe-from-route', {
    path: '/',
    maxAge: 60 * 60,
  });
  res.set('x-from', 'next-compose');
  const times = await testTime();
  res.json({
    ...times,
    user,
    user2: getNextContext().user,
    type,
    ...context.extraContent,
  });
});
