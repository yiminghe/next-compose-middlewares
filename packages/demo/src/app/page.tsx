import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '../middlewares';
import Link from 'next/link';
import { ClientProvider } from '../client-context/ClientContext';
import { UserInput } from './UserInput';
import { UserName } from './UserName';
import { setServerUser } from '@/server-context/serverContext';

export default createPage([
  user,
  ({ user, req, res }) => {
    setServerUser(user);
    res.render(
      <ClientProvider name={user}>
        <div>cookies: {JSON.stringify(req.cookies)}</div>
        <UserInput />
        <UserName />
        <Link href="/get">get</Link>
      </ClientProvider>,
    );
  },
]);
