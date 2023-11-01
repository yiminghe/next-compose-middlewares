import { createRoute } from 'next-compose-middlewares';
import { user, finishMiddleware } from '../../middlewares';

export const GET = createRoute([
  finishMiddleware,
  user,
  ({ user, response }) => {
    response.json = { user };
  },
]);
