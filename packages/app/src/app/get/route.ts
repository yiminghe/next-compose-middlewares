import { createRoute } from 'next-compose-middlewares';
import { user } from '../../middlewares';

export const GET = createRoute([
  user,
  ({ user, response }) => {
    response.json = { user };
  },
]);
