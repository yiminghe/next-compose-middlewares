import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '@/middlewares';
import { ClientProvider } from '@/client-context/ClientContext';
import components from '@/components';
import { setServerUser } from '@/server-context/serverContext';

let count = 0;
export default createPage([
  user,
  ({ user, res }) => {
    setServerUser(user);
    res.cookie('x-user2', 'yiminghe2', { path: '/' });
    const cs = ++count % 2 ? ['c1'] : ['c2'];
    res.render(
      <ClientProvider name={user}>
        <div>
          {cs.map((id) => {
            const C = components[id];
            return <C key={id} />;
          })}
        </div>
      </ClientProvider>,
    );
  },
]);
