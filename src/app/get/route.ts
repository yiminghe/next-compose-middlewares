import { getNextContext } from '@/next-compose-middlewares';
import { createRoute } from '../../middlewares';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const GET = createRoute(async function Get(...args) {
  console.log('Get', args);
  const context = getNextContext();
  const { user, res, type } = context;
  context.extraContent = {
    from: 'route',
  };
  await sleep(1000);
  res.cookie('x-user3', 'yiminghe', { path: '/' });
  res.set('x-from', 'next-compose');
  res.json({
    user,
    user2: getNextContext().user,
    type,
    ...context.extraContent,
  });
});
