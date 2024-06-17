import React from 'react';
import { getNextContext } from 'next-compose-middlewares';
import { createPage } from '@/middlewares';
import { ClientProvider } from '@/client-context/ClientContext';
import components from '@/components';
import Link from 'next/link';
import { runInExtraContext } from '../utils/extra-context';
import ExtraContextInfo from '../components/ExtraContextInfo';

let count = 0;
export default createPage(function Dynamic() {
  const { user, req, res } = getNextContext();
  res.cookie('x-user2', 'yiminghe2', { path: '/' });
  const cs = ++count % 2 ? ['c1'] : ['c2'];
  return runInExtraContext(
    {
      from: 'dynamic',
    },
    () => {
      return (
        <ClientProvider name={user}>
          <ExtraContextInfo />
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
        </ClientProvider>
      );
    },
  );
});
