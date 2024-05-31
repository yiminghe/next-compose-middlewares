import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '@/middlewares';
import { GlobalProvider } from '@/app/GlobalContext';
import components from '@/components';

export default createPage([
  user,
  ({ user, response }) => {
    const cs = Math.random() > 0.5 ? ['c1'] : ['c2'];
    response.jsx = (
      <GlobalProvider name={user}>
        <div>
          {cs.map((id) => {
            const C = components[id];
            return <C key={id} />;
          })}
        </div>
      </GlobalProvider>
    );
  },
]);
