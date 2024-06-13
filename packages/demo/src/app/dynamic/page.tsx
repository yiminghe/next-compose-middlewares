import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '@/middlewares';
import { ClientProvider } from '@/client-context/ClientContext';
import components from '@/components';
import Link from 'next/link';

let count = 0;
export default createPage([
  user,
  ({ user, req, res }) => {
    res.cookie('x-user2', 'yiminghe2', { path: '/' });
    const cs = ++count % 2 ? ['c1'] : ['c2'];
    res.render(
      <ClientProvider name={user}>
        <script>{`console.log(${JSON.stringify(req)});`}</script>
        <div>
          <Link href={`${req.path}/deep`}>deep</Link>
          &nbsp;
          <Link href={`${req.path}/deep2`}>deep2</Link>
        </div>
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
