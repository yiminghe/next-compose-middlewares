import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '@/middlewares';
import { GlobalProvider } from '@/app/GlobalContext';
import components from '@/components';

let count = 0;
export default createPage([
  user,
  ({ user, res }) => {
    res.cookie('x-user2', 'yiminghe2', { path: '/' });
    const cs = ++count % 2 ? ['c1'] : ['c2'];
    res.render(
      <GlobalProvider name={user}>
        <div>
          {cs.map((id) => {
            const C = components[id];
            return <C key={id} />;
          })}
        </div>
      </GlobalProvider>,
    );
  },
]);
