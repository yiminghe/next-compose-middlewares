import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '../middlewares';
import Link from 'next/link';
import { ClientProvider } from '../client-context/ClientContext';
import { UserInput } from './components/UserInput';
import { UserName } from './components/UserName';
import ServerInfo from './components/ServerInfo';

export default createPage([
  user,
  ({ user, res }) => {
    res.render(
      <ClientProvider name={user}>
        <ServerInfo />
        <UserInput />
        <UserName />
        <Link href="/get">get</Link>
      </ClientProvider>,
    );
  },
]);
