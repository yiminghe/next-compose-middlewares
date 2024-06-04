import { createRoute } from 'next-compose-middlewares';
import { user } from '../../middlewares';

export const GET = createRoute([
  user,
  ({ user, res }) => {
    res.set('x-from', 'next-compose');
    res.json({ user });
  },
]);
